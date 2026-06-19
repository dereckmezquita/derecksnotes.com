import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '@/types';
import { requirePermission } from '@middleware/auth';
import * as auditService from '@services/audit';
import * as userService from '@services/users';
import { db, schema } from '@db/index';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

const router = Router();
const uuidParamSchema = z.string().uuid();

/**
 * Resolve the groups assigned to a user — used by the ban handler to
 * enforce the "moderators cannot act on admins" boundary (I6).
 */
async function getUserGroupNames(userId: string): Promise<string[]> {
  const rows = await db.query.userGroups.findMany({
    where: eq(schema.userGroups.userId, userId),
    with: { group: true }
  });
  return rows.map((ug) => ug.group.name);
}

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
        res.status(400).json({ error: 'Invalid user ID format' });
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

      // Boundary checks (I6).
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

router.post(
  '/users/:id/unban',
  requirePermission('user.ban'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const idParsed = uuidParamSchema.safeParse(req.params.id);
      if (!idParsed.success) {
        res.status(400).json({ error: 'Invalid user ID format' });
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

/**
 * Toggle the mention-mute flag on a user. The user can still type
 * @mentions, but no notification fans to anyone they mention — abuse
 * control lever.
 */
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

export default router;
