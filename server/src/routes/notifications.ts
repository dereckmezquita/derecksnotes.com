import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate } from '@middleware/auth';
import * as notificationService from '@services/notifications';

const router = Router();

const uuidParamSchema = z.string().uuid();

router.get('/', authenticate(), async (req: AuthenticatedRequest, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 20)
    );
    const result = await notificationService.listForUser(
      req.user!.id,
      page,
      limit
    );
    res.json({
      data: result.notifications,
      total: result.total,
      page,
      limit,
      hasMore: page * limit < result.total
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get(
  '/unread-count',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const count = await notificationService.unreadCount(req.user!.id);
      res.json({ count });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/:id/read',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({ error: 'Invalid notification ID format' });
        return;
      }
      const ok = await notificationService.markRead(
        idParsed.data,
        req.user!.id
      );
      res.json({ success: ok });
    } catch (error) {
      console.error('Mark read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/read-all',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const count = await notificationService.markAllRead(req.user!.id);
      res.json({ success: true, count });
    } catch (error) {
      console.error('Mark all read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/:id',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({ error: 'Invalid notification ID format' });
        return;
      }
      const ok = await notificationService.deleteOne(
        idParsed.data,
        req.user!.id
      );
      res.json({ success: ok });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
