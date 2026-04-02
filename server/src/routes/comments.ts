import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate, optionalAuth } from '@middleware/auth';
import { commentLimiter } from '@middleware/rateLimit';
import * as commentService from '@services/comments';
import * as postService from '@services/posts';
import * as authService from '@services/auth';

const router = Router();

router.get('/', optionalAuth(), async (req: AuthenticatedRequest, res) => {
    const slug = req.query.slug as string;
    if (!slug) {
        res.status(400).json({ error: 'slug query parameter required' });
        return;
    }

    const post = await postService.findPostBySlug(slug);
    if (!post) {
        res.json({
            comments: [],
            total: 0,
            page: 1,
            limit: 20,
            hasMore: false
        });
        return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
        50,
        Math.max(1, parseInt(req.query.limit as string) || 20)
    );
    const maxDepth = Math.min(
        5,
        Math.max(0, parseInt(req.query.maxDepth as string) || 3)
    );

    const result = await commentService.getCommentsForPost(
        post.id,
        req.user?.id || null,
        page,
        limit,
        maxDepth
    );
    res.json(result);
});

router.post(
    '/',
    authenticate(),
    commentLimiter,
    async (req: AuthenticatedRequest, res) => {
        const parsed = z
            .object({
                slug: z.string().min(1),
                title: z.string().min(1),
                content: z.string().min(1).max(10000),
                parentId: z.string().uuid().optional()
            })
            .safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.issues
            });
            return;
        }

        const { slug, title, content, parentId } = parsed.data;
        const postId = await postService.getOrCreatePost(slug, title);

        // Check if user's groups allow auto-approve
        const userWithGroups =
            await authService.getUserWithGroupsAndPermissions(req.user!.id);
        const autoApprove = userWithGroups
            ? authService.isAutoApproveGroup(userWithGroups.groups)
            : false;

        try {
            const commentId = await commentService.createComment({
                postId,
                userId: req.user!.id,
                content,
                parentId,
                autoApprove
            });

            res.status(201).json({ id: commentId, approved: autoApprove });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
);

router.patch('/:id', authenticate(), async (req: AuthenticatedRequest, res) => {
    const parsed = z
        .object({ content: z.string().min(1).max(10000) })
        .safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            error: 'Validation failed',
            details: parsed.error.issues
        });
        return;
    }

    try {
        await commentService.editComment(
            req.params.id,
            req.user!.id,
            parsed.data.content
        );
        res.json({ success: true });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.delete(
    '/:id',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        try {
            await commentService.softDeleteComment(req.params.id, req.user!.id);
            res.json({ success: true });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
);

router.get('/:id/history', async (req: AuthenticatedRequest, res) => {
    const history = await commentService.getCommentHistory(req.params.id);
    res.json(history);
});

router.post(
    '/:id/reactions',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        const parsed = z
            .object({ type: z.enum(['like', 'dislike']) })
            .safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.issues
            });
            return;
        }

        const result = await commentService.reactToComment(
            req.params.id,
            req.user!.id,
            parsed.data.type
        );
        res.json(result);
    }
);

router.delete(
    '/:id/reactions',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        const result = await commentService.removeCommentReaction(
            req.params.id,
            req.user!.id
        );
        res.json(result);
    }
);

export default router;
