import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { requirePermission } from '@middleware/auth';
import * as commentService from '@services/comments';
import * as auditService from '@services/audit';

const router = Router();
const uuidParamSchema = z.string().uuid();

router.get(
  '/comments/pending',
  requirePermission('comment.approve'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 20)
      );

      const result = await commentService.getPendingComments(page, limit);
      res.json({
        data: result.comments,
        page,
        limit,
        total: result.total,
        hasMore: page * limit < result.total
      });
    } catch (error) {
      console.error('Get pending comments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/comments/:id/approve',
  requirePermission('comment.approve'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({ error: 'Invalid comment ID format' });
        return;
      }
      await commentService.approveComment(idParsed.data, req.user!.id);
      await auditService.logAuditAction(
        req.user!.id,
        'comment.approve',
        'comment',
        idParsed.data,
        undefined,
        req.ip
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Approve comment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/comments/:id/reject',
  requirePermission('comment.approve'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({ error: 'Invalid comment ID format' });
        return;
      }
      await commentService.rejectComment(idParsed.data);
      await auditService.logAuditAction(
        req.user!.id,
        'comment.reject',
        'comment',
        idParsed.data,
        undefined,
        req.ip
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Reject comment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

const bulkCommentsBody = z.object({
  commentIds: z.array(z.string().uuid()).min(1).max(100)
});

/**
 * I36: wrap the bulk mutation in a single transaction so a mid-list failure
 * does not leave the set half-applied. Audit row is logged AFTER the tx —
 * a rolled-back mutation with no audit row is preferable to an audit row
 * that lies about state.
 */
router.post(
  '/comments/bulk-approve',
  requirePermission('comment.approve'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = bulkCommentsBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }
      await commentService.approveCommentsBulk(
        parsed.data.commentIds,
        req.user!.id
      );
      await auditService.logAuditAction(
        req.user!.id,
        'comment.bulk-approve',
        'comment',
        null,
        { count: parsed.data.commentIds.length },
        req.ip
      );
      res.json({ success: true, count: parsed.data.commentIds.length });
    } catch (error) {
      console.error('Bulk approve error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/comments/bulk-reject',
  requirePermission('comment.approve'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = bulkCommentsBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }
      await commentService.rejectCommentsBulk(parsed.data.commentIds);
      await auditService.logAuditAction(
        req.user!.id,
        'comment.bulk-reject',
        'comment',
        null,
        { count: parsed.data.commentIds.length },
        req.ip
      );
      res.json({ success: true, count: parsed.data.commentIds.length });
    } catch (error) {
      console.error('Bulk reject error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
