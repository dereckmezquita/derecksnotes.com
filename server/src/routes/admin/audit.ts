import { Router } from 'express';
import type { AuthenticatedRequest } from '@/types';
import { requirePermission } from '@middleware/auth';
import { db, schema } from '@db/index';
import { desc, sql } from 'drizzle-orm';

const router = Router();

router.get(
  '/audit',
  requirePermission('admin.audit.view'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 20)
      );
      const offset = (page - 1) * limit;

      const entries = await db.query.auditLog.findMany({
        orderBy: [desc(schema.auditLog.createdAt)],
        limit,
        offset,
        with: {
          admin: {
            columns: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          }
        }
      });
      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.auditLog);

      res.json({
        data: entries.map((a) => ({
          ...a,
          details: a.details ? JSON.parse(a.details) : null
        })),
        page,
        limit,
        total: total[0]?.count || 0,
        hasMore: page * limit < (total[0]?.count || 0)
      });
    } catch (error) {
      console.error('Get audit log error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
