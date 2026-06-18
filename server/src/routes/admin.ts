import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { authenticate, requirePermission } from '@middleware/auth';
import { adminWriteLimiter } from '@middleware/rateLimit';
import * as commentService from '@services/comments';
import * as auditService from '@services/audit';
import * as notificationService from '@services/notifications';
import * as userService from '@services/users';
import * as bookmarkService from '@services/bookmarks';
import { db, schema } from '@db/index';
import { eq, and, isNull, desc, sql, inArray } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

const router = Router();

const uuidParamSchema = z.string().uuid();

// All admin routes require authentication, plus a tighter rate limit than
// the public surface (the population is small; the limiter mainly bounds
// runaway scripts).
router.use(authenticate());
router.use(adminWriteLimiter);

/**
 * Resolve the groups assigned to a user — used to enforce the
 * "moderators cannot act on admins" boundary (I6).
 */
async function getUserGroupNames(userId: string): Promise<string[]> {
  const rows = await db.query.userGroups.findMany({
    where: eq(schema.userGroups.userId, userId),
    with: { group: true }
  });
  return rows.map((ug) => ug.group.name);
}

// Dashboard
router.get(
  '/dashboard',
  requirePermission('admin.dashboard'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const pendingComments = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.comments)
        .where(
          and(
            eq(schema.comments.approved, 0),
            isNull(schema.comments.deletedAt)
          )
        );

      const totalUsers = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.users)
        .where(isNull(schema.users.deletedAt));

      const totalComments = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.comments);

      const totalPosts = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.posts);

      // Only callers who can already view the audit log get the recent-audit
      // slice; moderators with only `admin.dashboard` see stats but not the
      // audit feed (I7).
      const canSeeAudit = req.permissions?.has('admin.audit.view') ?? false;
      const recentAudit = canSeeAudit
        ? (
            await db.query.auditLog.findMany({
              orderBy: [desc(schema.auditLog.createdAt)],
              limit: 10,
              with: {
                admin: {
                  columns: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true
                  }
                }
              }
            })
          ).map((a) => ({
            ...a,
            details: a.details ? JSON.parse(a.details) : null
          }))
        : [];

      res.json({
        stats: {
          pendingComments: pendingComments[0]?.count || 0,
          totalUsers: totalUsers[0]?.count || 0,
          totalComments: totalComments[0]?.count || 0,
          totalPosts: totalPosts[0]?.count || 0
        },
        recentAudit
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Pending comments
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
        res.status(400).json({
          error: 'Invalid comment ID format'
        });
        return;
      }

      await commentService.approveComment(idParsed.data);
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
        res.status(400).json({
          error: 'Invalid comment ID format'
        });
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

router.post(
  '/comments/bulk-approve',
  requirePermission('comment.approve'),
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

      // I36: wrap the bulk mutation in a single transaction so a mid-list
      // failure does not leave the set half-applied. The audit row is logged
      // outside the transaction because audit_log entries are append-only
      // and a partial audit + rolled-back mutation is preferable to a
      // mutation with no audit.
      await db.transaction(async (tx) => {
        await tx
          .update(schema.comments)
          .set({ approved: 1 })
          .where(inArray(schema.comments.id, parsed.data.commentIds));
      });

      await auditService.logAuditAction(
        req.user!.id,
        'comment.bulk-approve',
        'comment',
        null,
        { count: parsed.data.commentIds.length },
        req.ip
      );

      res.json({
        success: true,
        count: parsed.data.commentIds.length
      });
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

      // I36: see note above on bulk-approve.
      await db.transaction(async (tx) => {
        await tx
          .update(schema.comments)
          .set({ deletedAt: new Date().toISOString() })
          .where(inArray(schema.comments.id, parsed.data.commentIds));
      });

      await auditService.logAuditAction(
        req.user!.id,
        'comment.bulk-reject',
        'comment',
        null,
        { count: parsed.data.commentIds.length },
        req.ip
      );

      res.json({
        success: true,
        count: parsed.data.commentIds.length
      });
    } catch (error) {
      console.error('Bulk reject error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Users
router.get(
  '/users',
  requirePermission('admin.users.manage'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 20)
      );
      const offset = (page - 1) * limit;

      const users = await db.query.users.findMany({
        where: isNull(schema.users.deletedAt),
        orderBy: [desc(schema.users.createdAt)],
        limit,
        offset
      });

      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.users)
        .where(isNull(schema.users.deletedAt));

      const result = [];
      for (const u of users) {
        const userGroupRows = await db.query.userGroups.findMany({
          where: eq(schema.userGroups.userId, u.id),
          with: { group: true }
        });

        const activeBan = await db.query.userBans.findFirst({
          where: and(
            eq(schema.userBans.userId, u.id),
            isNull(schema.userBans.liftedAt)
          )
        });

        result.push({
          id: u.id,
          username: u.username,
          email: u.email,
          displayName: u.displayName,
          groups: userGroupRows.map((ug) => ug.group.name),
          isBanned:
            !!activeBan &&
            (!activeBan.expiresAt ||
              new Date(activeBan.expiresAt) > new Date()),
          banExpiresAt: activeBan?.expiresAt || null,
          createdAt: u.createdAt,
          mentionMuted: !!u.mentionMuted
        });
      }

      res.json({
        data: result,
        page,
        limit,
        total: total[0]?.count || 0,
        hasMore: page * limit < (total[0]?.count || 0)
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/users/:id/ban',
  requirePermission('user.ban'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({
          error: 'Invalid user ID format'
        });
        return;
      }

      const parsed = z
        .object({
          reason: z.string().min(1).max(500).optional(),
          expiresAt: z.string().datetime().optional()
        })
        .safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }

      const targetId = idParsed.data;

      // Boundary checks (I6) — without these, any user with the user.ban
      // permission (moderators included) can ban admins, themselves, or
      // stack a second ban on someone already banned.
      if (targetId === req.user!.id) {
        res.status(400).json({ error: 'Cannot ban yourself' });
        return;
      }
      const targetGroups = await getUserGroupNames(targetId);
      const targetIsAdmin = targetGroups.includes('admin');
      const actorIsAdmin = req.permissions?.has('admin.dashboard') ?? false;
      if (targetIsAdmin && !actorIsAdmin) {
        res.status(403).json({ error: 'Moderators cannot ban administrators' });
        return;
      }
      if (targetIsAdmin) {
        // Refuse to leave the system without at least one admin.
        const adminGroup = await db.query.groups.findFirst({
          where: eq(schema.groups.name, 'admin')
        });
        if (adminGroup) {
          const allAdmins = await db.query.userGroups.findMany({
            where: eq(schema.userGroups.groupId, adminGroup.id)
          });
          if (allAdmins.length <= 1) {
            res
              .status(400)
              .json({ error: 'Cannot ban the last remaining administrator' });
            return;
          }
        }
      }
      const existingActiveBan = await db.query.userBans.findFirst({
        where: and(
          eq(schema.userBans.userId, targetId),
          isNull(schema.userBans.liftedAt)
        )
      });
      if (
        existingActiveBan &&
        (!existingActiveBan.expiresAt ||
          new Date(existingActiveBan.expiresAt) > new Date())
      ) {
        res.status(409).json({ error: 'User is already banned' });
        return;
      }

      await db.insert(schema.userBans).values({
        id: randomUUID(),
        userId: targetId,
        bannedBy: req.user!.id,
        reason: parsed.data?.reason || null,
        expiresAt: parsed.data?.expiresAt || null,
        createdAt: new Date().toISOString()
      });

      // Revoke all sessions
      await db
        .delete(schema.sessions)
        .where(eq(schema.sessions.userId, targetId));

      await auditService.logAuditAction(
        req.user!.id,
        'user.ban',
        'user',
        targetId,
        { reason: parsed.data?.reason },
        req.ip
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Ban user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Toggle the mention-mute flag on a user. Used as an abuse-control lever:
// the user can still write @mentions, but no notification fans to them.
router.post(
  '/users/:id/mention-mute',
  requirePermission('user.ban'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
      }
      const parsed = z.object({ muted: z.boolean() }).safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues
        });
        return;
      }
      await userService.setMentionMuted(idParsed.data, parsed.data.muted);
      await auditService.logAuditAction(
        req.user!.id,
        parsed.data.muted ? 'user.mention-mute' : 'user.mention-unmute',
        'user',
        idParsed.data,
        undefined,
        req.ip
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Mention-mute toggle error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post(
  '/users/:id/unban',
  requirePermission('user.ban'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({
          error: 'Invalid user ID format'
        });
        return;
      }

      const activeBan = await db.query.userBans.findFirst({
        where: and(
          eq(schema.userBans.userId, idParsed.data),
          isNull(schema.userBans.liftedAt)
        )
      });

      if (!activeBan) {
        res.status(404).json({ error: 'No active ban found' });
        return;
      }

      await db
        .update(schema.userBans)
        .set({
          liftedAt: new Date().toISOString(),
          liftedBy: req.user!.id
        })
        .where(eq(schema.userBans.id, activeBan.id));

      await auditService.logAuditAction(
        req.user!.id,
        'user.unban',
        'user',
        idParsed.data,
        undefined,
        req.ip
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Unban user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Audit log
router.get(
  '/audit',
  requirePermission('admin.audit.view'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 20)
      );
      const offset = (page - 1) * limit;

      const entries = await db.query.auditLog.findMany({
        orderBy: [desc(schema.auditLog.createdAt)],
        limit,
        offset,
        with: {
          admin: {
            columns: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          }
        }
      });

      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.auditLog);

      res.json({
        data: entries.map((a) => ({
          ...a,
          details: a.details ? JSON.parse(a.details) : null
        })),
        page,
        limit,
        total: total[0]?.count || 0,
        hasMore: page * limit < (total[0]?.count || 0)
      });
    } catch (error) {
      console.error('Get audit log error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Analytics
router.get(
  '/analytics',
  requirePermission('admin.dashboard'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const commentsPerDay = await db
        .select({
          date: sql<string>`date(${schema.comments.createdAt})`,
          count: sql<number>`count(*)`
        })
        .from(schema.comments)
        .where(
          and(
            sql`${schema.comments.createdAt} >= date('now', '-30 days')`,
            isNull(schema.comments.deletedAt)
          )
        )
        .groupBy(sql`date(${schema.comments.createdAt})`)
        .orderBy(sql`date(${schema.comments.createdAt}) ASC`);

      const usersPerDay = await db
        .select({
          date: sql<string>`date(${schema.users.createdAt})`,
          count: sql<number>`count(*)`
        })
        .from(schema.users)
        .where(
          and(
            sql`${schema.users.createdAt} >= date('now', '-30 days')`,
            isNull(schema.users.deletedAt)
          )
        )
        .groupBy(sql`date(${schema.users.createdAt})`)
        .orderBy(sql`date(${schema.users.createdAt}) ASC`);

      const topCommentedPosts = await db
        .select({
          slug: schema.posts.slug,
          title: schema.posts.title,
          count: sql<number>`count(${schema.comments.id})`
        })
        .from(schema.posts)
        .innerJoin(schema.comments, eq(schema.comments.postId, schema.posts.id))
        .where(isNull(schema.comments.deletedAt))
        .groupBy(schema.posts.id)
        .orderBy(sql`count(${schema.comments.id}) DESC`)
        .limit(5);

      const topLikedPosts = await db
        .select({
          slug: schema.posts.slug,
          title: schema.posts.title,
          likes: sql<number>`count(${schema.postReactions.id})`
        })
        .from(schema.posts)
        .innerJoin(
          schema.postReactions,
          eq(schema.postReactions.postId, schema.posts.id)
        )
        .where(eq(schema.postReactions.type, 'like'))
        .groupBy(schema.posts.id)
        .orderBy(sql`count(${schema.postReactions.id}) DESC`)
        .limit(5);

      const topBookmarkedPosts = await bookmarkService.getMostBookmarked(5);

      res.json({
        commentsPerDay,
        usersPerDay,
        topCommentedPosts,
        topLikedPosts,
        topBookmarkedPosts
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ============================================================================
// Notifications (admin)
// ============================================================================

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

// Global error handler for admin routes
router.use(
  (
    err: Error,
    _req: AuthenticatedRequest,
    res: import('express').Response,
    _next: import('express').NextFunction
  ) => {
    console.error('Admin route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

export default router;
