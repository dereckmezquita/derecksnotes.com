import { Router, type Response } from 'express';
import { db, schema } from '@db/index';
import { eq, and, gte, lte, like, or } from 'drizzle-orm';
import { authenticate, requirePermission } from '@middleware/auth';
import type { AuthenticatedRequest } from '@/types';
import { dbLogger } from '@services/logger';

const router = Router();

// GET /api/v1/admin/audit
router.get(
    '/',
    authenticate,
    requirePermission('admin.audit.view'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = Math.min(
                parseInt(req.query.limit as string) || 50,
                200
            );
            const offset = (page - 1) * limit;

            const { action, targetType, adminId, from, to } = req.query;

            let conditions: ReturnType<typeof eq>[] = [];

            if (action && typeof action === 'string') {
                conditions.push(like(schema.auditLog.action, `%${action}%`));
            }

            if (
                targetType &&
                typeof targetType === 'string' &&
                ['user', 'comment', 'report', 'group', 'permission'].includes(
                    targetType
                )
            ) {
                conditions.push(
                    eq(
                        schema.auditLog.targetType,
                        targetType as
                            | 'user'
                            | 'comment'
                            | 'report'
                            | 'group'
                            | 'permission'
                    )
                );
            }

            if (adminId && typeof adminId === 'string') {
                conditions.push(eq(schema.auditLog.adminId, adminId));
            }

            if (from && typeof from === 'string') {
                const fromDate = new Date(from);
                if (!isNaN(fromDate.getTime())) {
                    conditions.push(gte(schema.auditLog.createdAt, fromDate));
                }
            }

            if (to && typeof to === 'string') {
                const toDate = new Date(to);
                if (!isNaN(toDate.getTime())) {
                    conditions.push(lte(schema.auditLog.createdAt, toDate));
                }
            }

            const whereClause =
                conditions.length > 0 ? and(...conditions) : undefined;

            const logs = await db.query.auditLog.findMany({
                where: whereClause,
                with: {
                    admin: {
                        columns: {
                            id: true,
                            username: true
                        }
                    }
                },
                orderBy: (l, { desc }) => [desc(l.createdAt)],
                limit,
                offset
            });

            res.json({ logs, page, limit });
        } catch (error) {
            dbLogger.error('Get audit logs failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
