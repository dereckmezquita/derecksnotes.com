import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { requirePermission } from '@middleware/auth';
import * as reportService from '@services/reports';
import * as auditService from '@services/audit';

const router = Router();

const STATUS_VALUES = ['all', 'open', 'resolved', 'dismissed'] as const;

router.get(
  '/reports',
  requirePermission('report.view'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const status = (req.query.status as string) || 'open';
      const validStatus = (STATUS_VALUES as readonly string[]).includes(status)
        ? (status as (typeof STATUS_VALUES)[number])
        : 'open';
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 20)
      );
      const result = await reportService.listForAdmin(validStatus, page, limit);
      res.json({
        data: result.reports,
        page,
        limit,
        total: result.total,
        hasMore: page * limit < result.total
      });
    } catch (error) {
      console.error('Admin reports list error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/reports/bulk-status',
  requirePermission('report.resolve'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          ids: z.array(z.string().uuid()).min(1).max(100),
          status: z.enum(['resolved', 'dismissed', 'open'])
        })
        .safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }
      const count = await reportService.setStatus(
        parsed.data.ids,
        parsed.data.status,
        req.user!.id
      );
      await auditService.logAuditAction(
        req.user!.id,
        `report.bulk-${parsed.data.status}`,
        'report',
        null,
        { count },
        req.ip
      );
      res.json({ success: true, count });
    } catch (error) {
      console.error('Admin reports bulk status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
