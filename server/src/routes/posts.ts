import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate, optionalAuth } from '@middleware/auth';
import { reactionLimiter } from '@middleware/rateLimit';
import { notifyGraphClients } from '@routes/graph';
import * as postService from '@services/posts';
import * as bookmarkService from '@services/bookmarks';

const router = Router();

router.post(
  '/react',
  authenticate(),
  reactionLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          slug: z.string().min(1).max(500),
          title: z.string().min(1).max(500),
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

      // Notify graph SSE clients
      notifyGraphClients({
        type: 'reaction',
        data: { slug: parsed.data.slug, reactionType: parsed.data.type }
      });
    } catch (error) {
      console.error('React to post error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/react',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({ slug: z.string().min(1).max(500) })
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
    } catch (error) {
      console.error('Remove post reaction error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/stats', optionalAuth(), async (req: AuthenticatedRequest, res) => {
  try {
    const slugParsed = z.string().min(1).max(500).safeParse(req.query.slug);
    if (!slugParsed.success) {
      res.status(400).json({
        error: 'Valid slug query parameter required'
      });
      return;
    }

    const post = await postService.findPostBySlug(slugParsed.data);
    if (!post) {
      res.json({ likes: 0, dislikes: 0, userReaction: null });
      return;
    }

    const stats = await postService.getPostStats(post.id, req.user?.id || null);
    res.json(stats);
  } catch (error) {
    console.error('Get post stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reading-progress sink: ContentPost reports the percent scrolled (clamped
// 0..100) via debounced fetch. Idempotent upsert keyed on (user, post) so
// repeated writes never multiply rows. Only stores the MAX seen.
router.post(
  '/read-progress',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          slug: z.string().min(1).max(500),
          title: z.string().min(1).max(500),
          percent: z.coerce.number().min(0).max(100)
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
      const now = new Date().toISOString();
      await postService.upsertReadProgress(
        req.user!.id,
        postId,
        Math.round(parsed.data.percent),
        now
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Read-progress error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post('/read', authenticate(), async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = z
      .object({
        slug: z.string().min(1).max(500),
        title: z.string().min(1).max(500)
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
  } catch (error) {
    console.error('Mark post read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bookmarks — get / set / clear for the current post.
router.get(
  '/bookmark-status',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z.string().min(1).max(500).safeParse(req.query.slug);
      if (!parsed.success) {
        res.status(400).json({ error: 'Valid slug query parameter required' });
        return;
      }
      const post = await postService.findPostBySlug(parsed.data);
      if (!post) {
        res.json({ bookmarked: false });
        return;
      }
      const bookmarked = await bookmarkService.isBookmarked(
        req.user!.id,
        post.id
      );
      res.json({ bookmarked });
    } catch (error) {
      console.error('Bookmark status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/bookmark',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          slug: z.string().min(1).max(500),
          title: z.string().min(1).max(500)
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
      await bookmarkService.addBookmark(req.user!.id, postId);
      res.json({ success: true });
    } catch (error) {
      console.error('Add bookmark error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/bookmark',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({ slug: z.string().min(1).max(500) })
        .safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }
      const post = await postService.findPostBySlug(parsed.data.slug);
      if (post) await bookmarkService.removeBookmark(req.user!.id, post.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Remove bookmark error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Global error handler for post routes
router.use(
  (
    err: Error,
    _req: AuthenticatedRequest,
    res: import('express').Response,
    _next: import('express').NextFunction
  ) => {
    console.error('Post route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

export default router;
