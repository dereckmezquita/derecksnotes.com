import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate, optionalAuth } from '@middleware/auth';
import {
  commentLimiter,
  reactionLimiter,
  editLimiter
} from '@middleware/rateLimit';
import * as commentService from '@services/comments';
import * as postService from '@services/posts';
import * as authService from '@services/auth';

const router = Router();

const slugQuerySchema = z.string().min(1).max(500);
const uuidParamSchema = z.string().uuid();

router.get('/', optionalAuth(), async (req: AuthenticatedRequest, res) => {
  try {
    const slugParsed = slugQuerySchema.safeParse(req.query.slug);
    if (!slugParsed.success) {
      res.status(400).json({
        error: 'Valid slug query parameter required'
      });
      return;
    }

    const post = await postService.findPostBySlug(slugParsed.data);
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

    const repliesPerLevel = Math.min(
      20,
      Math.max(1, parseInt(req.query.repliesPerLevel as string) || 3)
    );

    const result = await commentService.getCommentsForPost(
      post.id,
      req.user?.id || null,
      page,
      limit,
      maxDepth,
      repliesPerLevel
    );
    res.json(result);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/',
  authenticate(),
  commentLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          slug: z.string().min(1).max(500),
          title: z.string().min(1).max(500),
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
      const userWithGroups = await authService.getUserWithGroupsAndPermissions(
        req.user!.id
      );
      const autoApprove = userWithGroups
        ? authService.isAutoApproveGroup(userWithGroups.groups)
        : false;

      const commentId = await commentService.createComment({
        postId,
        userId: req.user!.id,
        content,
        parentId,
        autoApprove
      });

      res.status(201).json({ id: commentId, approved: autoApprove });
    } catch (error: any) {
      if (error.message && !error.stack?.includes('at')) {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Create comment error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

router.patch(
  '/:id',
  authenticate(),
  editLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({
          error: 'Invalid comment ID format'
        });
        return;
      }

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

      await commentService.editComment(
        idParsed.data,
        req.user!.id,
        parsed.data.content
      );
      res.json({ success: true });
    } catch (error: any) {
      if (error.message && !error.stack?.includes('at')) {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Edit comment error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
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
        res.status(400).json({
          error: 'Invalid comment ID format'
        });
        return;
      }

      await commentService.softDeleteComment(idParsed.data, req.user!.id);
      res.json({ success: true });
    } catch (error: any) {
      if (error.message && !error.stack?.includes('at')) {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Delete comment error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

router.get('/:id/history', async (req: AuthenticatedRequest, res) => {
  try {
    const idParsed = uuidParamSchema.safeParse(req.params.id);
    if (!idParsed.success) {
      res.status(400).json({ error: 'Invalid comment ID format' });
      return;
    }

    const history = await commentService.getCommentHistory(idParsed.data);
    res.json(history);
  } catch (error) {
    console.error('Get comment history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get(
  '/:id/replies',
  optionalAuth(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({
          error: 'Invalid comment ID format'
        });
        return;
      }

      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        20,
        Math.max(1, parseInt(req.query.limit as string) || 5)
      );
      const result = await commentService.getRepliesForComment(
        idParsed.data,
        req.user?.id || null,
        page,
        limit
      );
      res.json(result);
    } catch (error) {
      console.error('Get replies error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/:id/reactions',
  authenticate(),
  reactionLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({
          error: 'Invalid comment ID format'
        });
        return;
      }

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
        idParsed.data,
        req.user!.id,
        parsed.data.type
      );
      res.json(result);
    } catch (error) {
      console.error('React to comment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/:id/reactions',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({
          error: 'Invalid comment ID format'
        });
        return;
      }

      const result = await commentService.removeCommentReaction(
        idParsed.data,
        req.user!.id
      );
      res.json(result);
    } catch (error) {
      console.error('Remove comment reaction error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Global error handler for comment routes
router.use(
  (
    err: Error,
    _req: AuthenticatedRequest,
    res: import('express').Response,
    _next: import('express').NextFunction
  ) => {
    console.error('Comment route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

export default router;
