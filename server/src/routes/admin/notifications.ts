import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { requirePermission } from '@middleware/auth';
import * as notificationService from '@services/notifications';
import * as userService from '@services/users';
import * as auditService from '@services/audit';

const router = Router();

router.get(
  '/notifications/stats',
  requirePermission('admin.dashboard'),
  async (_req: AuthenticatedRequest, res) => {
    try {
      const stats = await notificationService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Notifications stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/notifications/send',
  requirePermission('admin.dashboard'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          username: z.string().min(1).max(30),
          message: z.string().min(1).max(1000)
        })
        .safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }
      const recipient = await userService.findUserByUsername(
        parsed.data.username
      );
      if (!recipient) {
        res.status(404).json({ error: 'Recipient not found' });
        return;
      }
      await notificationService.createNotification({
        userId: recipient.id,
        type: 'admin.message',
        actorUserId: req.user!.id,
        payload: { message: parsed.data.message }
      });
      await auditService.logAuditAction(
        req.user!.id,
        'notification.send',
        'user',
        recipient.id,
        { messagePreview: parsed.data.message.slice(0, 80) },
        req.ip
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Notification send error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/notifications/broadcast',
  requirePermission('admin.dashboard'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          message: z.string().min(1).max(1000)
        })
        .safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }
      const recipientIds = await notificationService.listActiveUserIds([
        req.user!.id
      ]);
      const count = await notificationService.createNotificationsForUsers(
        recipientIds,
        {
          type: 'admin.broadcast',
          actorUserId: req.user!.id,
          payload: { message: parsed.data.message }
        }
      );
      await auditService.logAuditAction(
        req.user!.id,
        'notification.broadcast',
        'user',
        null,
        { recipients: count, messagePreview: parsed.data.message.slice(0, 80) },
        req.ip
      );
      res.json({ success: true, recipients: count });
    } catch (error) {
      console.error('Notification broadcast error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
