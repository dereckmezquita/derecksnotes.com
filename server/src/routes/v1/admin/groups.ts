import { Router, type Response } from 'express';
import { z } from 'zod';
import { db, schema } from '@db/index';
import { eq, and } from 'drizzle-orm';
import { authenticate, requirePermission } from '@middleware/auth';
import { logAuditAction } from '@services/audit';
import type { AuthenticatedRequest } from '@/types';
import { dbLogger } from '@services/logger';

const router = Router();

// Validation schemas
const createGroupSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters')
        .regex(
            /^[a-z][a-z0-9_-]*$/,
            'Name must start with lowercase letter and contain only lowercase letters, numbers, underscores, and hyphens'
        ),
    description: z.string().max(500).optional(),
    isDefault: z.boolean().optional()
});

const updateGroupSchema = z.object({
    description: z.string().max(500).optional(),
    isDefault: z.boolean().optional()
});

const updatePermissionsSchema = z.object({
    permissions: z.array(z.string())
});

// GET /api/v1/admin/groups
router.get(
    '/',
    authenticate,
    requirePermission('admin.dashboard'),
    async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const groups = await db.query.groups.findMany({
                with: {
                    groupPermissions: {
                        with: {
                            permission: true
                        }
                    }
                },
                orderBy: (g, { asc }) => [asc(g.name)]
            });

            const formattedGroups = groups.map((group) => ({
                id: group.id,
                name: group.name,
                description: group.description,
                isDefault: group.isDefault,
                createdAt: group.createdAt,
                permissions: group.groupPermissions
                    .filter((gp) => gp.permission)
                    .map((gp) => ({
                        id: gp.permission!.id,
                        name: gp.permission!.name,
                        description: gp.permission!.description,
                        category: gp.permission!.category
                    }))
            }));

            res.json({ groups: formattedGroups });
        } catch (error) {
            dbLogger.error('Get groups failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/permissions
router.get(
    '/permissions',
    authenticate,
    requirePermission('admin.dashboard'),
    async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const permissions = await db.query.permissions.findMany({
                orderBy: (p, { asc }) => [asc(p.category), asc(p.name)]
            });

            // Group by category
            const byCategory: Record<string, typeof permissions> = {};
            for (const perm of permissions) {
                if (!byCategory[perm.category]) {
                    byCategory[perm.category] = [];
                }
                byCategory[perm.category]!.push(perm);
            }

            res.json({ permissions, byCategory });
        } catch (error) {
            dbLogger.error('Get permissions failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/admin/groups/:id - Get single group with details
router.get(
    '/:id',
    authenticate,
    requirePermission('admin.dashboard'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const group = await db.query.groups.findFirst({
                where: eq(schema.groups.id, id),
                with: {
                    groupPermissions: {
                        with: {
                            permission: true
                        }
                    },
                    userGroups: {
                        with: {
                            user: {
                                columns: {
                                    id: true,
                                    username: true,
                                    displayName: true
                                }
                            }
                        }
                    }
                }
            });

            if (!group) {
                res.status(404).json({ error: 'Group not found' });
                return;
            }

            res.json({
                group: {
                    id: group.id,
                    name: group.name,
                    description: group.description,
                    isDefault: group.isDefault,
                    createdAt: group.createdAt,
                    permissions: group.groupPermissions
                        .filter((gp) => gp.permission)
                        .map((gp) => ({
                            id: gp.permission!.id,
                            name: gp.permission!.name,
                            description: gp.permission!.description,
                            category: gp.permission!.category
                        })),
                    members: group.userGroups.map((ug) => ({
                        id: ug.user.id,
                        username: ug.user.username,
                        displayName: ug.user.displayName
                    })),
                    memberCount: group.userGroups.length
                }
            });
        } catch (error) {
            dbLogger.error('Get group failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/admin/groups - Create a new group
router.post(
    '/',
    authenticate,
    requirePermission('admin.groups.manage'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = createGroupSchema.parse(req.body);

            // Check if name already exists
            const existing = await db.query.groups.findFirst({
                where: eq(schema.groups.name, data.name)
            });

            if (existing) {
                res.status(409).json({ error: 'Group name already exists' });
                return;
            }

            // If setting as default, unset other defaults
            if (data.isDefault) {
                await db
                    .update(schema.groups)
                    .set({ isDefault: false })
                    .where(eq(schema.groups.isDefault, true));
            }

            const groupId = crypto.randomUUID();
            await db.insert(schema.groups).values({
                id: groupId,
                name: data.name,
                description: data.description || null,
                isDefault: data.isDefault || false
            });

            await logAuditAction(
                req.user!.id,
                'group.create',
                'group',
                groupId,
                { name: data.name },
                req.ip || req.socket.remoteAddress
            );

            const group = await db.query.groups.findFirst({
                where: eq(schema.groups.id, groupId)
            });

            res.status(201).json({ group });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Create group failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// PATCH /api/v1/admin/groups/:id - Update group details
router.patch(
    '/:id',
    authenticate,
    requirePermission('admin.groups.manage'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const data = updateGroupSchema.parse(req.body);

            const group = await db.query.groups.findFirst({
                where: eq(schema.groups.id, id)
            });

            if (!group) {
                res.status(404).json({ error: 'Group not found' });
                return;
            }

            // Prevent modifying system groups (user, trusted, moderator, admin)
            const systemGroups = ['user', 'trusted', 'moderator', 'admin'];
            if (systemGroups.includes(group.name)) {
                // Allow changing description but not isDefault for system groups
                if (
                    data.isDefault !== undefined &&
                    data.isDefault !== group.isDefault
                ) {
                    res.status(400).json({
                        error: 'Cannot change default status of system groups'
                    });
                    return;
                }
            }

            // If setting as default, unset other defaults
            if (data.isDefault && !group.isDefault) {
                await db
                    .update(schema.groups)
                    .set({ isDefault: false })
                    .where(eq(schema.groups.isDefault, true));
            }

            const updates: Partial<typeof schema.groups.$inferInsert> = {};
            if (data.description !== undefined)
                updates.description = data.description;
            if (data.isDefault !== undefined)
                updates.isDefault = data.isDefault;

            if (Object.keys(updates).length > 0) {
                await db
                    .update(schema.groups)
                    .set(updates)
                    .where(eq(schema.groups.id, id));
            }

            await logAuditAction(
                req.user!.id,
                'group.update',
                'group',
                id,
                { changes: updates },
                req.ip || req.socket.remoteAddress
            );

            const updatedGroup = await db.query.groups.findFirst({
                where: eq(schema.groups.id, id)
            });

            res.json({ group: updatedGroup });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Update group failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// DELETE /api/v1/admin/groups/:id - Delete a group
router.delete(
    '/:id',
    authenticate,
    requirePermission('admin.groups.manage'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const group = await db.query.groups.findFirst({
                where: eq(schema.groups.id, id),
                with: {
                    userGroups: true
                }
            });

            if (!group) {
                res.status(404).json({ error: 'Group not found' });
                return;
            }

            // Prevent deleting system groups
            const systemGroups = ['user', 'trusted', 'moderator', 'admin'];
            if (systemGroups.includes(group.name)) {
                res.status(400).json({ error: 'Cannot delete system groups' });
                return;
            }

            // Check if group has members
            if (group.userGroups.length > 0) {
                res.status(400).json({
                    error: `Cannot delete group with ${group.userGroups.length} members. Remove all members first.`
                });
                return;
            }

            // Delete group permissions first (cascade should handle this but being explicit)
            await db
                .delete(schema.groupPermissions)
                .where(eq(schema.groupPermissions.groupId, id));

            // Delete the group
            await db.delete(schema.groups).where(eq(schema.groups.id, id));

            await logAuditAction(
                req.user!.id,
                'group.delete',
                'group',
                id,
                { name: group.name },
                req.ip || req.socket.remoteAddress
            );

            res.json({ message: 'Group deleted' });
        } catch (error) {
            dbLogger.error('Delete group failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// PUT /api/v1/admin/groups/:id/permissions - Sync group permissions (GitHub-style)
router.put(
    '/:id/permissions',
    authenticate,
    requirePermission('admin.permissions.assign'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const data = updatePermissionsSchema.parse(req.body);

            const group = await db.query.groups.findFirst({
                where: eq(schema.groups.id, id)
            });

            if (!group) {
                res.status(404).json({ error: 'Group not found' });
                return;
            }

            // Get all available permissions
            const allPermissions = await db.query.permissions.findMany();
            const permissionNameToId = new Map(
                allPermissions.map((p) => [p.name, p.id])
            );

            // Validate all requested permission names exist
            for (const permName of data.permissions) {
                if (!permissionNameToId.has(permName)) {
                    res.status(400).json({
                        error: `Invalid permission: ${permName}`
                    });
                    return;
                }
            }

            // Get current group permissions
            const currentPerms = await db.query.groupPermissions.findMany({
                where: eq(schema.groupPermissions.groupId, id),
                with: { permission: true }
            });
            const currentPermNames = new Set(
                currentPerms.map((gp) => gp.permission?.name).filter(Boolean)
            );

            // Calculate additions and removals
            const toAdd = data.permissions.filter(
                (p) => !currentPermNames.has(p)
            );
            const toRemove = [...currentPermNames].filter(
                (p) => p && !data.permissions.includes(p)
            );

            // Add new permissions
            for (const permName of toAdd) {
                const permId = permissionNameToId.get(permName)!;
                await db.insert(schema.groupPermissions).values({
                    id: crypto.randomUUID(),
                    groupId: id,
                    permissionId: permId
                });
            }

            // Remove old permissions
            for (const permName of toRemove) {
                if (!permName) continue;
                const permId = permissionNameToId.get(permName)!;
                await db
                    .delete(schema.groupPermissions)
                    .where(
                        and(
                            eq(schema.groupPermissions.groupId, id),
                            eq(schema.groupPermissions.permissionId, permId)
                        )
                    );
            }

            // Log the change if anything changed
            if (toAdd.length > 0 || toRemove.length > 0) {
                await logAuditAction(
                    req.user!.id,
                    'group.permissions_updated',
                    'group',
                    id,
                    {
                        added: toAdd,
                        removed: toRemove,
                        newPermissions: data.permissions
                    },
                    req.ip || req.socket.remoteAddress
                );
            }

            res.json({
                message: 'Group permissions updated',
                permissions: data.permissions,
                added: toAdd,
                removed: toRemove
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Update group permissions failed', error as Error, {
                source: 'admin'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
