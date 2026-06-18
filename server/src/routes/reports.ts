import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate } from '@middleware/auth';
import * as reportService from '@services/reports';

const router = Router();

// User-facing endpoint: report a comment or user.
// One per (reporter, target) is not enforced — a user can re-report the same
// target if the situation changes; admins see the volume on the queue.
router.post('/', authenticate(), async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = z
      .object({
        targetType: z.enum(['comment', 'user']),
        targetId: z.string().min(1).max(200),
        reason: z.enum(['spam', 'harassment', 'misinformation', 'other']),
        details: z.string().max(1000).optional()
      })
      .safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues
      });
      return;
    }
    const id = await reportService.createReport({
      reporterId: req.user!.id,
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      reason: parsed.data.reason,
      details: parsed.data.details || null
    });
    res.status(201).json({ id });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
