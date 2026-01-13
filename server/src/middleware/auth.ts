import type { Response, NextFunction } from 'express';
import {
    getSessionByToken,
    extendSession,
    getUserPermissions,
    isUserBanned,
    revokeSession
} from '@services/auth';
import type { AuthenticatedRequest } from '@/types';

export async function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    const sessionToken = req.cookies?.sessionId;

    if (!sessionToken) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    // Look up session in database
    const session = await getSessionByToken(sessionToken);

    if (!session) {
        res.clearCookie('sessionId');
        res.status(401).json({ error: 'Invalid or expired session' });
        return;
    }

    const user = session.user;

    // Check if user is deleted
    if (user.deletedAt) {
        res.clearCookie('sessionId');
        res.status(401).json({ error: 'User not found' });
        return;
    }

    // Check if user is banned
    const banned = await isUserBanned(user.id);
    if (banned) {
        // Revoke session immediately when banned
        await revokeSession(session.id);
        res.clearCookie('sessionId');
        res.status(403).json({ error: 'Account is banned' });
        return;
    }

    // Sliding expiration - extend session if needed
    await extendSession(session.id);

    // Load permissions
    const permissions = await getUserPermissions(user.id);

    req.user = {
        id: user.id,
        username: user.username
    };
    req.sessionId = session.id;
    req.permissions = permissions;

    next();
}

export async function optionalAuth(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): Promise<void> {
    const sessionToken = req.cookies?.sessionId;

    if (!sessionToken) {
        next();
        return;
    }

    const session = await getSessionByToken(sessionToken);

    if (session && !session.user.deletedAt) {
        req.user = {
            id: session.user.id,
            username: session.user.username
        };
        req.sessionId = session.id;
        // Don't load permissions for optional auth to save DB queries
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
