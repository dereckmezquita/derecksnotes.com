import { Response, NextFunction } from 'express';
import {
    verifyToken,
    getUserPermissions,
    isUserBanned
} from '../services/auth';
import { db, schema } from '../db';
import { eq, isNull, and } from 'drizzle-orm';
import type { AuthenticatedRequest } from '../types';

export async function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const payload = verifyToken(accessToken);
    if (!payload || payload.type !== 'access') {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }

    // Check if user exists and is not deleted
    const user = await db.query.users.findFirst({
        where: and(
            eq(schema.users.id, payload.userId),
            isNull(schema.users.deletedAt)
        )
    });

    if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
    }

    // Check if user is banned
    const banned = await isUserBanned(user.id);
    if (banned) {
        res.status(403).json({ error: 'Account is banned' });
        return;
    }

    // Load permissions
    const permissions = await getUserPermissions(user.id);

    req.user = {
        id: user.id,
        username: user.username
    };
    req.permissions = permissions;

    next();
}

export function optionalAuth(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): void {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        next();
        return;
    }

    const payload = verifyToken(accessToken);
    if (payload && payload.type === 'access') {
        req.user = {
            id: payload.userId,
            username: payload.username
        };
        // We don't load permissions for optional auth to save DB queries
    }

    next();
}

export function requirePermission(...permissions: string[]) {
    return async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        // Load permissions if not already loaded
        if (!req.permissions) {
            req.permissions = await getUserPermissions(req.user.id);
        }

        const hasPermission = permissions.some((p) => req.permissions?.has(p));
        if (!hasPermission) {
            res.status(403).json({
                error: 'Insufficient permissions',
                required: permissions
            });
            return;
        }

        next();
    };
}
