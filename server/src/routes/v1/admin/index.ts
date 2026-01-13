import { Router, Response } from 'express';
import { db, schema } from '../../../db';
import { eq, sql } from 'drizzle-orm';
import { authenticate, requirePermission } from '../../../middleware/auth';
import type { AuthenticatedRequest } from '../../../types';

import commentsRouter from './comments';
import usersRouter from './users';
import reportsRouter from './reports';
import auditRouter from './audit';
import groupsRouter from './groups';

const router = Router();

// Mount sub-routers
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);
router.use('/reports', reportsRouter);
router.use('/audit', auditRouter);
router.use('/groups', groupsRouter);

// GET /api/v1/admin/dashboard
router.get(
    '/dashboard',
    authenticate,
    requirePermission('admin.dashboard'),
    async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            // Pending comments count
            const pendingComments = await db
                .select({ count: sql<number>`count(*)` })
                .from(schema.comments)
                .where(eq(schema.comments.approved, false));

            // Pending reports count
            const pendingReports = await db
                .select({ count: sql<number>`count(*)` })
                .from(schema.reports)
                .where(eq(schema.reports.status, 'pending'));

            // Total users count
            const totalUsers = await db
                .select({ count: sql<number>`count(*)` })
                .from(schema.users);

            // Total comments count
            const totalComments = await db
                .select({ count: sql<number>`count(*)` })
                .from(schema.comments);

            // Recent audit log entries
            const recentActivity = await db.query.auditLog.findMany({
                with: {
                    admin: {
                        columns: {
                            id: true,
                            username: true
                        }
                    }
                },
                orderBy: (l, { desc }) => [desc(l.createdAt)],
                limit: 10
            });

            res.json({
                stats: {
                    pendingComments: pendingComments[0]?.count || 0,
                    pendingReports: pendingReports[0]?.count || 0,
                    totalUsers: totalUsers[0]?.count || 0,
                    totalComments: totalComments[0]?.count || 0
                },
                recentActivity
            });
        } catch (error) {
            console.error('Get dashboard error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
