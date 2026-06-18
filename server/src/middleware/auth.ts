import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '@/types';
import { db, schema } from '@db/index';
import { eq, and, gt, isNull, desc } from 'drizzle-orm';
import { hashSessionToken } from '@services/auth';

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

    const tokenHash = hashSessionToken(token);
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(schema.sessions.tokenHash, tokenHash),
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

    // Check ban status. Order by createdAt desc so any "active ban" query
    // elsewhere consistently sees the newest first (I15 also addresses this
    // by writing liftedAt when an expired ban is observed).
    const activeBan = await db.query.userBans.findFirst({
      where: and(
        eq(schema.userBans.userId, session.user.id),
        isNull(schema.userBans.liftedAt)
      ),
      orderBy: [desc(schema.userBans.createdAt)]
    });

    if (activeBan) {
      if (activeBan.expiresAt && new Date(activeBan.expiresAt) < new Date()) {
        // I15: mark expired bans as lifted in the DB the first time we see
        // them so future "has active ban" queries stop returning them. Best
        // effort — if the update fails we still allow the request through.
        try {
          await db
            .update(schema.userBans)
            .set({ liftedAt: new Date().toISOString() })
            .where(eq(schema.userBans.id, activeBan.id));
        } catch (err) {
          console.error('[auth] failed to mark expired ban as lifted:', err);
        }
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

    const tokenHash = hashSessionToken(token);
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(schema.sessions.tokenHash, tokenHash),
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
