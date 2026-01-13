import { Router, type Response } from 'express';
import { z } from 'zod';
import { db, schema } from '../../../db';
import { eq, and, isNull, like, or } from 'drizzle-orm';
import { authenticate, requirePermission } from '../../../middleware/auth';
import { logAuditAction } from '../../../services/audit';
import { revokeAllSessions } from '../../../services/auth';
import type { AuthenticatedRequest } from '../../../types';

const router = Router();

// Validation schemas
const banUserSchema = z.object({
    reason: z.string().min(1, 'Reason is required').max(500),
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
            console.error('Get users error:', error);
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

            // Get ban history
            const bans = await db.query.userBans.findMany({
                where: eq(schema.userBans.userId, id),
                orderBy: (b, { desc }) => [desc(b.createdAt)]
            });

            res.json({
                ...user,
                groups: userGroups.map((ug) => ({
                    id: ug.group.id,
                    name: ug.group.name,
                    assignedAt: ug.assignedAt
                })),
                bans
            });
        } catch (error) {
            console.error('Get user error:', error);
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
                reason: data.reason,
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
            console.error('Ban user error:', error);
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
            console.error('Unban user error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/users/:id/groups
router.post(
    '/:id/groups',
    authenticate,
    requirePermission('admin.users.manage'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const { groupId, action } = req.body;

            if (!groupId || !['add', 'remove'].includes(action)) {
                res.status(400).json({
                    error: 'groupId and action (add/remove) are required'
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

            const group = await db.query.groups.findFirst({
                where: eq(schema.groups.id, groupId)
            });

            if (!group) {
                res.status(404).json({ error: 'Group not found' });
                return;
            }

            if (action === 'add') {
                const existing = await db.query.userGroups.findFirst({
                    where: and(
                        eq(schema.userGroups.userId, id),
                        eq(schema.userGroups.groupId, groupId)
                    )
                });

                if (existing) {
                    res.status(409).json({
                        error: 'User already in this group'
                    });
                    return;
                }

                await db.insert(schema.userGroups).values({
                    id: crypto.randomUUID(),
                    userId: id,
                    groupId
                });

                await logAuditAction(
                    req.user!.id,
                    'user.group_add',
                    'user',
                    id,
                    { groupId, groupName: group.name },
                    req.ip || req.socket.remoteAddress
                );
            } else {
                await db
                    .delete(schema.userGroups)
                    .where(
                        and(
                            eq(schema.userGroups.userId, id),
                            eq(schema.userGroups.groupId, groupId)
                        )
                    );

                await logAuditAction(
                    req.user!.id,
                    'user.group_remove',
                    'user',
                    id,
                    { groupId, groupName: group.name },
                    req.ip || req.socket.remoteAddress
                );
            }

            res.json({
                message: `User ${action === 'add' ? 'added to' : 'removed from'} group`
            });
        } catch (error) {
            console.error('Update user groups error:', error);
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
            console.error('Delete user error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
