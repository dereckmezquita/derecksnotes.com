import { Router, Response } from 'express';
import { db, schema } from '../../../db';
import { eq } from 'drizzle-orm';
import { authenticate, requirePermission } from '../../../middleware/auth';
import type { AuthenticatedRequest } from '../../../types';

const router = Router();

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
                permissions: group.groupPermissions.map((gp) => ({
                    id: gp.permission.id,
                    name: gp.permission.name,
                    description: gp.permission.description,
                    category: gp.permission.category
                }))
            }));

            res.json({ groups: formattedGroups });
        } catch (error) {
            console.error('Get groups error:', error);
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
            const byCategory = permissions.reduce(
                (acc, perm) => {
                    if (!acc[perm.category]) {
                        acc[perm.category] = [];
                    }
                    acc[perm.category].push(perm);
                    return acc;
                },
                {} as Record<string, typeof permissions>
            );

            res.json({ permissions, byCategory });
        } catch (error) {
            console.error('Get permissions error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
