import { Router, type Response } from 'express';
import { z } from 'zod';
import { db, schema } from '../../../db';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import { authenticate, requirePermission } from '../../../middleware/auth';
import { logAuditAction } from '../../../services/audit';
import type { AuthenticatedRequest } from '../../../types';

const router = Router();

// GET /api/v1/admin/comments/pending
router.get(
    '/pending',
    authenticate,
    requirePermission('comment.approve'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = Math.min(
                parseInt(req.query.limit as string) || 20,
                100
            );
            const offset = (page - 1) * limit;

            const comments = await db.query.comments.findMany({
                where: and(
                    eq(schema.comments.approved, false),
                    isNull(schema.comments.deletedAt)
                ),
                with: {
                    user: {
                        columns: {
                            id: true,
                            username: true,
                            displayName: true
                        }
                    }
                },
                orderBy: (c, { asc }) => [asc(c.createdAt)],
                limit,
                offset
            });

            res.json({ comments, page, limit });
        } catch (error) {
            console.error('Get pending comments error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/comments/:id/approve
router.post(
    '/:id/approve',
    authenticate,
    requirePermission('comment.approve'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const comment = await db.query.comments.findFirst({
                where: eq(schema.comments.id, id)
            });

            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            await db
                .update(schema.comments)
                .set({ approved: true })
                .where(eq(schema.comments.id, id));

            await logAuditAction(
                req.user!.id,
                'comment.approve',
                'comment',
                id,
                { postSlug: comment.postSlug },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: 'Comment approved' });
        } catch (error) {
            console.error('Approve comment error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/comments/:id/reject
router.post(
    '/:id/reject',
    authenticate,
    requirePermission('comment.approve'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const comment = await db.query.comments.findFirst({
                where: eq(schema.comments.id, id)
            });

            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            // Soft delete the comment (rejection is a soft delete)
            await db
                .update(schema.comments)
                .set({ deletedAt: new Date() })
                .where(eq(schema.comments.id, id));

            await logAuditAction(
                req.user!.id,
                'comment.reject',
                'comment',
                id,
                { postSlug: comment.postSlug, reason: req.body.reason },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: 'Comment rejected' });
        } catch (error) {
            console.error('Reject comment error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/comments/bulk-approve
router.post(
    '/bulk-approve',
    authenticate,
    requirePermission('comment.approve'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ error: 'ids array is required' });
                return;
            }

            if (ids.length > 100) {
                res.status(400).json({
                    error: 'Maximum 100 comments per batch'
                });
                return;
            }

            await db
                .update(schema.comments)
                .set({ approved: true })
                .where(inArray(schema.comments.id, ids));

            await logAuditAction(
                req.user!.id,
                'comment.bulk_approve',
                'comment',
                ids.join(','),
                { count: ids.length },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: `${ids.length} comments approved` });
        } catch (error) {
            console.error('Bulk approve comments error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/comments/bulk-delete
router.post(
    '/bulk-delete',
    authenticate,
    requirePermission('comment.delete.any'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ error: 'ids array is required' });
                return;
            }

            if (ids.length > 100) {
                res.status(400).json({
                    error: 'Maximum 100 comments per batch'
                });
                return;
            }

            await db
                .update(schema.comments)
                .set({ deletedAt: new Date() })
                .where(inArray(schema.comments.id, ids));

            await logAuditAction(
                req.user!.id,
                'comment.bulk_delete',
                'comment',
                ids.join(','),
                { count: ids.length },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: `${ids.length} comments deleted` });
        } catch (error) {
            console.error('Bulk delete comments error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
