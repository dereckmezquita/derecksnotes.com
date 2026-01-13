import { Router, type Response } from 'express';
import { db, schema } from '../../../db';
import { eq, and, sql } from 'drizzle-orm';
import { authenticate, requirePermission } from '../../../middleware/auth';
import { logAuditAction } from '../../../services/audit';
import type { AuthenticatedRequest } from '../../../types';
import { dbLogger } from '../../../services/logger';

const router = Router();

const HIGH_REPORT_THRESHOLD = 3; // Number of reports to flag as high priority

// GET /api/v1/admin/reports
router.get(
    '/',
    authenticate,
    requirePermission('report.view'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = Math.min(
                parseInt(req.query.limit as string) || 20,
                100
            );
            const offset = (page - 1) * limit;
            const status = req.query.status as string;

            let whereClause = undefined;
            if (
                status &&
                ['pending', 'reviewed', 'dismissed'].includes(status)
            ) {
                whereClause = eq(
                    schema.reports.status,
                    status as 'pending' | 'reviewed' | 'dismissed'
                );
            }

            const reports = await db.query.reports.findMany({
                where: whereClause,
                with: {
                    reporter: {
                        columns: {
                            id: true,
                            username: true
                        }
                    },
                    comment: {
                        columns: {
                            id: true,
                            content: true,
                            postSlug: true
                        },
                        with: {
                            user: {
                                columns: {
                                    id: true,
                                    username: true
                                }
                            }
                        }
                    }
                },
                orderBy: (r, { desc }) => [desc(r.createdAt)],
                limit,
                offset
            });

            // Get report counts per comment to identify high-priority reports
            const commentIds = [...new Set(reports.map((r) => r.commentId))];
            const reportCounts = new Map<string, number>();

            for (const commentId of commentIds) {
                const countResult = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(schema.reports)
                    .where(eq(schema.reports.commentId, commentId));

                reportCounts.set(commentId, countResult[0]?.count || 0);
            }

            const reportsWithPriority = reports.map((report) => ({
                ...report,
                reportCount: reportCounts.get(report.commentId) || 1,
                isHighPriority:
                    (reportCounts.get(report.commentId) || 1) >=
                    HIGH_REPORT_THRESHOLD
            }));

            res.json({ reports: reportsWithPriority, page, limit });
        } catch (error) {
            dbLogger.error('Get reports failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/reports/stats
router.get(
    '/stats',
    authenticate,
    requirePermission('report.view'),
    async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const pendingCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(schema.reports)
                .where(eq(schema.reports.status, 'pending'));

            const reviewedCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(schema.reports)
                .where(eq(schema.reports.status, 'reviewed'));

            const dismissedCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(schema.reports)
                .where(eq(schema.reports.status, 'dismissed'));

            // High priority - count comments with >= threshold pending reports
            // Using a subquery approach since db.execute is not available
            const allPendingReports = await db.query.reports.findMany({
                where: eq(schema.reports.status, 'pending'),
                columns: { commentId: true }
            });

            // Count comments with >= threshold reports
            const commentReportCounts = new Map<string, number>();
            for (const report of allPendingReports) {
                const count = commentReportCounts.get(report.commentId) || 0;
                commentReportCounts.set(report.commentId, count + 1);
            }
            const highPriorityCount = Array.from(
                commentReportCounts.values()
            ).filter((count) => count >= HIGH_REPORT_THRESHOLD).length;

            res.json({
                pending: pendingCount[0]?.count || 0,
                reviewed: reviewedCount[0]?.count || 0,
                dismissed: dismissedCount[0]?.count || 0,
                highPriority: highPriorityCount
            });
        } catch (error) {
            dbLogger.error('Get report stats failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/reports/:id/review
router.post(
    '/:id/review',
    authenticate,
    requirePermission('report.resolve'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const { action, deleteComment } = req.body;

            if (!action || !['reviewed', 'dismissed'].includes(action)) {
                res.status(400).json({
                    error: 'action must be "reviewed" or "dismissed"'
                });
                return;
            }

            const report = await db.query.reports.findFirst({
                where: eq(schema.reports.id, id)
            });

            if (!report) {
                res.status(404).json({ error: 'Report not found' });
                return;
            }

            // Update report status
            await db
                .update(schema.reports)
                .set({
                    status: action,
                    reviewedBy: req.user!.id,
                    reviewedAt: new Date()
                })
                .where(eq(schema.reports.id, id));

            // Optionally delete the reported comment
            if (deleteComment && action === 'reviewed') {
                await db
                    .update(schema.comments)
                    .set({ deletedAt: new Date() })
                    .where(eq(schema.comments.id, report.commentId));

                await logAuditAction(
                    req.user!.id,
                    'comment.delete_from_report',
                    'comment',
                    report.commentId,
                    { reportId: id },
                    req.ip || req.socket.remoteAddress
                );
            }

            await logAuditAction(
                req.user!.id,
                `report.${action}`,
                'report',
                id,
                { commentId: report.commentId, deleteComment },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: `Report ${action}` });
        } catch (error) {
            dbLogger.error('Review report failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/reports/bulk-review
router.post(
    '/bulk-review',
    authenticate,
    requirePermission('report.resolve'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { ids, action } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ error: 'ids array is required' });
                return;
            }

            if (!action || !['reviewed', 'dismissed'].includes(action)) {
                res.status(400).json({
                    error: 'action must be "reviewed" or "dismissed"'
                });
                return;
            }

            if (ids.length > 100) {
                res.status(400).json({
                    error: 'Maximum 100 reports per batch'
                });
                return;
            }

            for (const id of ids) {
                await db
                    .update(schema.reports)
                    .set({
                        status: action,
                        reviewedBy: req.user!.id,
                        reviewedAt: new Date()
                    })
                    .where(eq(schema.reports.id, id));
            }

            await logAuditAction(
                req.user!.id,
                `report.bulk_${action}`,
                'report',
                ids.join(','),
                { count: ids.length },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: `${ids.length} reports ${action}` });
        } catch (error) {
            dbLogger.error('Bulk review reports failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
