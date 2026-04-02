import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate, optionalAuth } from '@middleware/auth';
import { reactionLimiter } from '@middleware/rateLimit';
import * as postService from '@services/posts';

const router = Router();

router.post(
    '/react',
    authenticate(),
    reactionLimiter,
    async (req: AuthenticatedRequest, res) => {
        const parsed = z
            .object({
                slug: z.string().min(1),
                title: z.string().min(1),
                type: z.enum(['like', 'dislike'])
            })
            .safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.issues
            });
            return;
        }

        const postId = await postService.getOrCreatePost(
            parsed.data.slug,
            parsed.data.title
        );
        const result = await postService.reactToPost(
            postId,
            req.user!.id,
            parsed.data.type
        );
        res.json(result);
    }
);

router.delete(
    '/react',
    authenticate(),
    async (req: AuthenticatedRequest, res) => {
        const parsed = z
            .object({ slug: z.string().min(1) })
            .safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.issues
            });
            return;
        }

        const post = await postService.findPostBySlug(parsed.data.slug);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const result = await postService.removePostReaction(
            post.id,
            req.user!.id
        );
        res.json(result);
    }
);

router.get('/stats', optionalAuth(), async (req: AuthenticatedRequest, res) => {
    const slug = req.query.slug as string;
    if (!slug) {
        res.status(400).json({ error: 'slug query parameter required' });
        return;
    }

    const post = await postService.findPostBySlug(slug);
    if (!post) {
        res.json({ likes: 0, dislikes: 0, userReaction: null });
        return;
    }

    const stats = await postService.getPostStats(post.id, req.user?.id || null);
    res.json(stats);
});

router.post('/read', authenticate(), async (req: AuthenticatedRequest, res) => {
    const parsed = z
        .object({
            slug: z.string().min(1),
            title: z.string().min(1)
        })
        .safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({
            error: 'Validation failed',
            details: parsed.error.issues
        });
        return;
    }

    const postId = await postService.getOrCreatePost(
        parsed.data.slug,
        parsed.data.title
    );
    await postService.markPostRead(req.user!.id, postId);
    res.json({ success: true });
});

export default router;
