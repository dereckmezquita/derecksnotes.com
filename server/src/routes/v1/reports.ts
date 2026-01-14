import { Router, type Response } from 'express';
import { z } from 'zod';
import { db, schema } from '@db/index';
import { eq, and, isNull } from 'drizzle-orm';
import { authenticate, requirePermission } from '@middleware/auth';
import { reportLimiter } from '@middleware/rateLimit';
import type { AuthenticatedRequest } from '@/types';
import { dbLogger } from '@services/logger';

const router = Router();

// Validation schemas
const createReportSchema = z.object({
    commentId: z.string().uuid('Invalid comment ID'),
    reason: z.enum([
        'spam',
        'harassment',
        'inappropriate',
        'misinformation',
        'other'
    ]),
    details: z
        .string()
        .max(1000, 'Details must be at most 1000 characters')
        .optional()
});

// POST /api/v1/reports
router.post(
    '/',
    authenticate,
    requirePermission('report.create'),
    reportLimiter,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = createReportSchema.parse(req.body);

            // Check if comment exists
            const comment = await db.query.comments.findFirst({
                where: and(
                    eq(schema.comments.id, data.commentId),
                    isNull(schema.comments.deletedAt)
                )
            });

            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            // Can't report your own comment
            if (comment.userId === req.user!.id) {
                res.status(400).json({
                    error: 'Cannot report your own comment'
                });
                return;
            }

            // Check if user already reported this comment
            const existingReport = await db.query.reports.findFirst({
                where: and(
                    eq(schema.reports.commentId, data.commentId),
                    eq(schema.reports.reporterId, req.user!.id)
                )
            });

            if (existingReport) {
                res.status(409).json({
                    error: 'You have already reported this comment'
                });
                return;
            }

            // Create report
            const reportId = crypto.randomUUID();

            await db.insert(schema.reports).values({
                id: reportId,
                reporterId: req.user!.id,
                commentId: data.commentId,
                reason: data.reason,
                details: data.details || null
            });

            res.status(201).json({
                message: 'Report submitted successfully',
                reportId
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Create report failed', error as Error, {
                source: 'reports'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
