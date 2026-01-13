import { Router, type Response } from 'express';
import { z } from 'zod';
import { db, schema } from '@db/index';
import { eq, and, isNull, like, or } from 'drizzle-orm';
import { authenticate, requirePermission } from '@middleware/auth';
import { logAuditAction } from '@services/audit';
import { revokeAllSessions } from '@services/auth';
import type { AuthenticatedRequest } from '@/types';
import { dbLogger } from '@services/logger';

const router = Router();

// Validation schemas
const banUserSchema = z.object({
    reason: z.string().max(500).optional(),
    expiresAt: z.string().datetime().optional()
});

// GET /api/v1/admin/users
router.get(
    '/',
    authenticate,
    requirePermission('admin.users.manage'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = Math.min(
                parseInt(req.query.limit as string) || 20,
                100
            );
            const offset = (page - 1) * limit;
            const search = req.query.search as string;

            let whereClause = isNull(schema.users.deletedAt);

            if (search) {
                whereClause = and(
                    whereClause,
                    or(
                        like(schema.users.username, `%${search}%`),
                        like(schema.users.email, `%${search}%`)
                    )
                )!;
            }

            const users = await db.query.users.findMany({
                where: whereClause,
                columns: {
                    id: true,
                    username: true,
                    email: true,
                    displayName: true,
                    emailVerified: true,
                    createdAt: true
                },
                orderBy: (u, { desc }) => [desc(u.createdAt)],
                limit,
                offset
            });

            // Get groups for each user
            const usersWithGroups = await Promise.all(
                users.map(async (user) => {
                    const userGroups = await db.query.userGroups.findMany({
                        where: eq(schema.userGroups.userId, user.id),
                        with: { group: { columns: { name: true } } }
                    });

                    const activeBan = await db.query.userBans.findFirst({
                        where: and(
                            eq(schema.userBans.userId, user.id),
                            isNull(schema.userBans.liftedAt)
                        )
                    });

                    return {
                        ...user,
                        groups: userGroups.map((ug) => ug.group.name),
                        isBanned: !!activeBan,
                        banInfo: activeBan
                            ? {
                                  reason: activeBan.reason,
                                  expiresAt: activeBan.expiresAt,
                                  createdAt: activeBan.createdAt
                              }
                            : null
                    };
                })
            );

            res.json({ users: usersWithGroups, page, limit });
        } catch (error) {
            dbLogger.error('Get users failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/users/:id
router.get(
    '/:id',
    authenticate,
    requirePermission('admin.users.manage'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const user = await db.query.users.findFirst({
                where: eq(schema.users.id, id),
                columns: {
                    id: true,
                    username: true,
                    email: true,
                    displayName: true,
                    bio: true,
                    avatarUrl: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true
                }
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Get groups
            const userGroups = await db.query.userGroups.findMany({
                where: eq(schema.userGroups.userId, id),
                with: { group: true }
            });

            // Get active ban
            const activeBan = await db.query.userBans.findFirst({
                where: and(
                    eq(schema.userBans.userId, id),
                    isNull(schema.userBans.liftedAt)
                )
            });

            // Get ban history
            const bans = await db.query.userBans.findMany({
                where: eq(schema.userBans.userId, id),
                orderBy: (b, { desc }) => [desc(b.createdAt)]
            });

            res.json({
                user: {
                    ...user,
                    groups: userGroups.map((ug) => ug.group.name),
                    isBanned: !!activeBan,
                    banReason: activeBan?.reason || null,
                    banExpiresAt: activeBan?.expiresAt?.toISOString() || null
                },
                bans
            });
        } catch (error) {
            dbLogger.error('Get user failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/users/:id/ban
router.post(
    '/:id/ban',
    authenticate,
    requirePermission('user.ban'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const data = banUserSchema.parse(req.body);

            // Can't ban yourself
            if (id === req.user!.id) {
                res.status(400).json({ error: 'Cannot ban yourself' });
                return;
            }

            const user = await db.query.users.findFirst({
                where: eq(schema.users.id, id)
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Check if already banned
            const existingBan = await db.query.userBans.findFirst({
                where: and(
                    eq(schema.userBans.userId, id),
                    isNull(schema.userBans.liftedAt)
                )
            });

            if (existingBan) {
                res.status(409).json({ error: 'User is already banned' });
                return;
            }

            // Create ban
            const banId = crypto.randomUUID();
            await db.insert(schema.userBans).values({
                id: banId,
                userId: id,
                bannedBy: req.user!.id,
                reason: data.reason || 'No reason provided',
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
            });

            // Revoke all sessions
            await revokeAllSessions(id);

            await logAuditAction(
                req.user!.id,
                'user.ban',
                'user',
                id,
                { reason: data.reason, expiresAt: data.expiresAt },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: 'User banned successfully' });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Ban user failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/users/:id/unban
router.post(
    '/:id/unban',
    authenticate,
    requirePermission('user.ban'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const activeBan = await db.query.userBans.findFirst({
                where: and(
                    eq(schema.userBans.userId, id),
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
                    liftedAt: new Date(),
                    liftedBy: req.user!.id
                })
                .where(eq(schema.userBans.id, activeBan.id));

            await logAuditAction(
                req.user!.id,
                'user.unban',
                'user',
                id,
                { previousBanId: activeBan.id },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: 'User unbanned successfully' });
        } catch (error) {
            dbLogger.error('Unban user failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/users/:id/groups - Sync user groups (accepts array of group names)
router.post(
    '/:id/groups',
    authenticate,
    requirePermission('admin.users.manage'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const { groups } = req.body;

            // Validate input
            if (!Array.isArray(groups)) {
                res.status(400).json({
                    error: 'groups array is required'
                });
                return;
            }

            const user = await db.query.users.findFirst({
                where: eq(schema.users.id, id)
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Get all available groups
            const allGroups = await db.query.groups.findMany();
            const groupNameToId = new Map(allGroups.map((g) => [g.name, g.id]));

            // Validate all requested group names exist
            for (const groupName of groups) {
                if (!groupNameToId.has(groupName)) {
                    res.status(400).json({
                        error: `Invalid group name: ${groupName}`
                    });
                    return;
                }
            }

            // Get current user groups
            const currentUserGroups = await db.query.userGroups.findMany({
                where: eq(schema.userGroups.userId, id),
                with: { group: true }
            });
            const currentGroupNames = new Set(
                currentUserGroups.map((ug) => ug.group.name)
            );

            // Calculate additions and removals
            const toAdd = groups.filter(
                (g: string) => !currentGroupNames.has(g)
            );
            const toRemove = [...currentGroupNames].filter(
                (g) => !groups.includes(g)
            );

            // Add new groups
            for (const groupName of toAdd) {
                const groupId = groupNameToId.get(groupName)!;
                await db.insert(schema.userGroups).values({
                    id: crypto.randomUUID(),
                    userId: id,
                    groupId
                });
            }

            // Remove old groups
            for (const groupName of toRemove) {
                const groupId = groupNameToId.get(groupName)!;
                await db
                    .delete(schema.userGroups)
                    .where(
                        and(
                            eq(schema.userGroups.userId, id),
                            eq(schema.userGroups.groupId, groupId)
                        )
                    );
            }

            // Log the change if anything changed
            if (toAdd.length > 0 || toRemove.length > 0) {
                await logAuditAction(
                    req.user!.id,
                    'user.groups_updated',
                    'user',
                    id,
                    {
                        added: toAdd,
                        removed: toRemove,
                        newGroups: groups
                    },
                    req.ip || req.socket.remoteAddress
                );
            }

            res.json({
                message: 'User groups updated',
                groups: groups
            });
        } catch (error) {
            dbLogger.error('Update user groups failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// DELETE /api/v1/admin/users/:id (soft delete)
router.delete(
    '/:id',
    authenticate,
    requirePermission('user.delete.any'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            // Can't delete yourself
            if (id === req.user!.id) {
                res.status(400).json({ error: 'Cannot delete yourself' });
                return;
            }

            const user = await db.query.users.findFirst({
                where: eq(schema.users.id, id)
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            if (user.deletedAt) {
                res.status(409).json({ error: 'User already deleted' });
                return;
            }

            await db
                .update(schema.users)
                .set({ deletedAt: new Date(), updatedAt: new Date() })
                .where(eq(schema.users.id, id));

            await revokeAllSessions(id);

            await logAuditAction(
                req.user!.id,
                'user.delete',
                'user',
                id,
                { username: user.username },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            dbLogger.error('Delete user failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
