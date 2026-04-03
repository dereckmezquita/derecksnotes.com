import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '@/types';
import { db, schema } from '@db/index';
import { eq, and, gt, isNull } from 'drizzle-orm';

export function authenticate() {
    return async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        const token = req.cookies?.sessionId;
        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const session = await db.query.sessions.findFirst({
            where: and(
                eq(schema.sessions.token, token),
                gt(schema.sessions.expiresAt, new Date().toISOString())
            ),
            with: { user: true }
        });

        if (!session || !session.user) {
            res.clearCookie('sessionId');
            res.status(401).json({ error: 'Invalid or expired session' });
            return;
        }

        if (session.user.deletedAt) {
            res.clearCookie('sessionId');
            res.status(401).json({ error: 'Account has been deleted' });
            return;
        }

        // Check ban status
        const activeBan = await db.query.userBans.findFirst({
            where: and(
                eq(schema.userBans.userId, session.user.id),
                isNull(schema.userBans.liftedAt)
            )
        });

        if (activeBan) {
            if (
                activeBan.expiresAt &&
                new Date(activeBan.expiresAt) < new Date()
            ) {
                // Ban expired — ignore
            } else {
                res.clearCookie('sessionId');
                res.status(403).json({
                    error: 'Account is banned',
                    reason: activeBan.reason
                });
                return;
            }
        }

        // Load permissions
        const userGroupRows = await db.query.userGroups.findMany({
            where: eq(schema.userGroups.userId, session.user.id),
            with: {
                group: {
                    with: {
                        groupPermissions: {
                            with: { permission: true }
                        }
                    }
                }
            }
        });

        const perms = new Set<string>();
        for (const ug of userGroupRows) {
            for (const gp of ug.group.groupPermissions) {
                perms.add(gp.permission.name);
            }
        }

        req.user = { id: session.user.id, username: session.user.username };
        req.sessionId = session.id;
        req.permissions = perms;
        next();
    };
}

export function optionalAuth() {
    return async (
        req: AuthenticatedRequest,
        _res: Response,
        next: NextFunction
    ) => {
        const token = req.cookies?.sessionId;
        if (!token) {
            next();
            return;
        }

        const session = await db.query.sessions.findFirst({
            where: and(
                eq(schema.sessions.token, token),
                gt(schema.sessions.expiresAt, new Date().toISOString())
            ),
            with: { user: true }
        });

        if (session?.user && !session.user.deletedAt) {
            req.user = { id: session.user.id, username: session.user.username };
            req.sessionId = session.id;
        }

        next();
    };
}

export function requirePermission(...requiredPermissions: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.permissions) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const hasPermission = requiredPermissions.some((p) =>
            req.permissions!.has(p)
        );
        if (!hasPermission) {
            res.status(403).json({
                error: 'Insufficient permissions',
                required: requiredPermissions
            });
            return;
        }

        next();
    };
}
