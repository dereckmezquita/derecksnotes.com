import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate } from '@middleware/auth';
import {
  profileLimiter,
  passwordChangeLimiter,
  accountDeleteLimiter,
  bulkLimiter,
  searchLimiter
} from '@middleware/rateLimit';
import * as userService from '@services/users';
import * as authService from '@services/auth';
import * as auditService from '@services/audit';
import * as bookmarkService from '@services/bookmarks';
import * as followService from '@services/follows';
import { config } from '@lib/env';

const router = Router();

const usernameParamSchema = z
  .string()
  .min(1)
  .max(30)
  .regex(/^[a-zA-Z0-9_-]+$/);

// Prefix search for mention autocomplete. Placed BEFORE the `/:username` route
// so the literal "search" segment doesn't get captured as a username.
// searchLimiter caps per-IP request rate — the client debounces keystrokes
// but a misbehaving consumer could still hammer this endpoint.
router.get(
  '/search',
  authenticate(),
  searchLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const q = z.string().min(1).max(50).safeParse(req.query.q);
      if (!q.success) {
        res.json({ data: [] });
        return;
      }
      const rows = await userService.searchUsernames(q.data, 10);
      res.json({ data: rows });
    } catch (error) {
      console.error('User search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/:username', async (req: AuthenticatedRequest, res) => {
  try {
    const usernameParsed = usernameParamSchema.safeParse(req.params.username);
    if (!usernameParsed.success) {
      res.status(400).json({ error: 'Invalid username format' });
      return;
    }

    const user = await userService.findUserByUsername(usernameParsed.data);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Inline follower / following counts so the profile page can render
    // them without a second round-trip.
    const [followers, following] = await Promise.all([
      followService.followerCount(user.id),
      followService.followingCount(user.id)
    ]);

    res.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      location: user.location,
      socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : [],
      createdAt: user.createdAt,
      followerCount: followers,
      followingCount: following
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:username/activity', async (req: AuthenticatedRequest, res) => {
  try {
    const usernameParsed = usernameParamSchema.safeParse(req.params.username);
    if (!usernameParsed.success) {
      res.status(400).json({ error: 'Invalid username format' });
      return;
    }
    const target = await userService.findUserByUsername(usernameParsed.data);
    if (!target) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const items = await userService.getUserActivity(target.id, 30);
    res.json({ data: items });
  } catch (error) {
    console.error('User activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get(
  '/:username/top-comments',
  async (req: AuthenticatedRequest, res) => {
    try {
      const usernameParsed = usernameParamSchema.safeParse(req.params.username);
      if (!usernameParsed.success) {
        res.status(400).json({ error: 'Invalid username format' });
        return;
      }
      const target = await userService.findUserByUsername(usernameParsed.data);
      if (!target) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        20,
        Math.max(1, parseInt(req.query.limit as string) || 5)
      );
      const result = await userService.getTopComments(target.id, page, limit);
      res.json({
        data: result.items,
        page: result.page,
        limit: result.limit,
        total: result.total,
        hasMore: result.hasMore
      });
    } catch (error) {
      console.error('User top-comments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/:username/follow',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const usernameParsed = usernameParamSchema.safeParse(req.params.username);
      if (!usernameParsed.success) {
        res.status(400).json({ error: 'Invalid username format' });
        return;
      }
      const target = await userService.findUserByUsername(usernameParsed.data);
      if (!target) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      if (target.id === req.user!.id) {
        res.status(400).json({ error: 'Cannot follow yourself' });
        return;
      }
      await followService.follow(req.user!.id, target.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Follow error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/:username/follow',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const usernameParsed = usernameParamSchema.safeParse(req.params.username);
      if (!usernameParsed.success) {
        res.status(400).json({ error: 'Invalid username format' });
        return;
      }
      const target = await userService.findUserByUsername(usernameParsed.data);
      if (!target) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      await followService.unfollow(req.user!.id, target.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Unfollow error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get(
  '/:username/follow-status',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const usernameParsed = usernameParamSchema.safeParse(req.params.username);
      if (!usernameParsed.success) {
        res.status(400).json({ error: 'Invalid username format' });
        return;
      }
      const target = await userService.findUserByUsername(usernameParsed.data);
      if (!target) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const following = await followService.isFollowing(
        req.user!.id,
        target.id
      );
      res.json({ following });
    } catch (error) {
      console.error('Follow-status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get(
  '/me/following-feed',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const limit = Math.min(
        50,
        Math.max(1, parseInt(req.query.limit as string) || 30)
      );
      const items = await followService.followingFeed(req.user!.id, limit);
      res.json({ data: items });
    } catch (error) {
      console.error('Following feed error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.patch('/me', authenticate(), async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = z
      .object({
        displayName: z.string().min(1).max(50).optional(),
        bio: z.string().max(500).optional(),
        avatarUrl: z.string().url().max(2048).nullable().optional(),
        location: z.string().max(100).nullable().optional(),
        socialLinks: z
          .array(
            z.object({
              label: z.string().min(1).max(30),
              // Force HTTPS — no `javascript:`, `data:`, or http surface.
              url: z
                .string()
                .url()
                .max(500)
                .refine((u) => u.startsWith('https://'), {
                  message: 'Social links must use https://'
                })
            })
          )
          .max(8)
          .nullable()
          .optional()
      })
      .safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues
      });
      return;
    }

    const updated = await userService.updateProfile(req.user!.id, parsed.data);
    res.json({
      id: updated!.id,
      username: updated!.username,
      displayName: updated!.displayName,
      bio: updated!.bio,
      avatarUrl: updated!.avatarUrl,
      location: updated!.location,
      socialLinks: updated!.socialLinks ? JSON.parse(updated!.socialLinks) : []
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch(
  '/me/username',
  authenticate(),
  profileLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          username: z
            .string()
            .min(3)
            .max(30)
            .regex(/^[a-zA-Z0-9_-]+$/)
        })
        .safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }

      if (!(await userService.isUsernameAvailable(parsed.data.username))) {
        res.status(409).json({ error: 'Username already taken' });
        return;
      }

      await userService.changeUsername(req.user!.id, parsed.data.username);
      res.json({ success: true, username: parsed.data.username });
    } catch (error) {
      console.error('Change username error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/me/password',
  authenticate(),
  passwordChangeLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          currentPassword: z.string().min(1).max(128),
          newPassword: z
            .string()
            .min(8)
            .max(128)
            .regex(/[A-Z]/)
            .regex(/[a-z]/)
            .regex(/[0-9]/)
        })
        .safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }

      const user = await userService.findUserById(req.user!.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const valid = await authService.verifyPassword(
        parsed.data.currentPassword,
        user.passwordHash
      );
      if (!valid) {
        res.status(401).json({
          error: 'Current password is incorrect'
        });
        return;
      }

      const hash = await authService.hashPassword(parsed.data.newPassword);
      await userService.changePassword(req.user!.id, hash);

      // Revoke all other sessions
      await authService.revokeAllSessions(req.user!.id);
      const session = await authService.createSession(
        req.user!.id,
        req.headers['user-agent'],
        req.ip
      );

      res.cookie('sessionId', session.token, {
        httpOnly: true,
        secure: config.secureCookies,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      await auditService.logAuditAction(
        req.user!.id,
        'auth.password-change',
        'user',
        req.user!.id,
        undefined,
        req.ip
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/me',
  authenticate(),
  accountDeleteLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      await userService.softDeleteUser(req.user!.id);
      await authService.revokeAllSessions(req.user!.id);
      await auditService.logAuditAction(
        req.user!.id,
        'auth.account-delete',
        'user',
        req.user!.id,
        undefined,
        req.ip
      );
      res.clearCookie('sessionId');
      res.json({ success: true });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get(
  '/me/comments',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        50,
        Math.max(1, parseInt(req.query.limit as string) || 20)
      );

      const result = await userService.getUserComments(
        req.user!.id,
        page,
        limit
      );
      res.json({
        data: result.comments,
        page,
        limit,
        total: result.total,
        hasMore: page * limit < result.total
      });
    } catch (error) {
      console.error('Get user comments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/me/comments/bulk-delete',
  authenticate(),
  bulkLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = z
        .object({
          commentIds: z.array(z.string().uuid()).min(1).max(100)
        })
        .safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }

      const deleted = await userService.bulkDeleteComments(
        req.user!.id,
        parsed.data.commentIds
      );
      res.json({ success: true, deleted });
    } catch (error) {
      console.error('Bulk delete comments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get(
  '/me/bookmarks',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        50,
        Math.max(1, parseInt(req.query.limit as string) || 20)
      );
      const result = await bookmarkService.listForUser(
        req.user!.id,
        page,
        limit
      );
      res.json({
        data: result.bookmarks,
        page,
        limit,
        total: result.total,
        hasMore: page * limit < result.total
      });
    } catch (error) {
      console.error('Get bookmarks error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get(
  '/me/read-history',
  authenticate(),
  async (req: AuthenticatedRequest, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        50,
        Math.max(1, parseInt(req.query.limit as string) || 20)
      );

      const result = await userService.getReadHistory(
        req.user!.id,
        page,
        limit
      );
      res.json({
        data: result.entries,
        page,
        limit,
        total: result.total,
        hasMore: page * limit < result.total
      });
    } catch (error) {
      console.error('Get read history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * DELETE /users/me/read-history — body { slug } removes a single entry;
 * empty body wipes the whole history. Same endpoint, two semantics, so the
 * client can use one route for both flows.
 */
router.delete(
  '/me/read-history',
  authenticate(),
  bulkLimiter,
  async (req: AuthenticatedRequest, res) => {
    try {
      const body = req.body ?? {};
      const parsed = z
        .object({ slug: z.string().min(1).max(500).optional() })
        .safeParse(body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }
      if (parsed.data.slug) {
        const removed = await userService.removeReadHistoryForSlug(
          req.user!.id,
          parsed.data.slug
        );
        res.json({ success: true, removed });
        return;
      }
      const cleared = await userService.clearReadHistory(req.user!.id);
      res.json({ success: true, cleared });
    } catch (error) {
      console.error('Delete read history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Global error handler for user routes
router.use(
  (
    err: Error,
    _req: AuthenticatedRequest,
    res: import('express').Response,
    _next: import('express').NextFunction
  ) => {
    console.error('User route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

export default router;
