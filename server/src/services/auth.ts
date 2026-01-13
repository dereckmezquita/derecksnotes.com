import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { db, schema } from '../db';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { config } from '../lib/env';

const SALT_ROUNDS = 12;
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SLIDING_WINDOW_MS = 60 * 60 * 1000; // 1 hour - only extend if last extended > 1 hour ago
const MAX_SESSIONS = 5;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export async function getSessionByToken(sessionToken: string) {
    return db.query.sessions.findFirst({
        where: and(
            eq(schema.sessions.sessionToken, sessionToken),
            isNull(schema.sessions.revokedAt),
            gt(schema.sessions.expiresAt, new Date())
        ),
        with: {
            user: true
        }
    });
}

export async function extendSession(sessionId: string): Promise<boolean> {
    const session = await db.query.sessions.findFirst({
        where: eq(schema.sessions.id, sessionId)
    });

    if (!session || session.revokedAt) return false;

    // Only extend if the session will expire within the sliding window
    // (i.e., hasn't been extended recently)
    const extendThreshold = new Date(
        Date.now() + SESSION_EXPIRY_MS - SLIDING_WINDOW_MS
    );
    if (session.expiresAt > extendThreshold) {
        return true; // Already recently extended
    }

    await db
        .update(schema.sessions)
        .set({ expiresAt: new Date(Date.now() + SESSION_EXPIRY_MS) })
        .where(eq(schema.sessions.id, sessionId));

    return true;
}

export async function createSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string
): Promise<string> {
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);

    // Check active sessions count
    const activeSessions = await db.query.sessions.findMany({
        where: and(
            eq(schema.sessions.userId, userId),
            isNull(schema.sessions.revokedAt),
            gt(schema.sessions.expiresAt, new Date())
        )
    });

    // If at max sessions, revoke the oldest one
    if (activeSessions.length >= MAX_SESSIONS) {
        const oldestSession = activeSessions.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        )[0];
        if (oldestSession) {
            await db
                .update(schema.sessions)
                .set({ revokedAt: new Date() })
                .where(eq(schema.sessions.id, oldestSession.id));
        }
    }

    // Create new session
    await db.insert(schema.sessions).values({
        id: crypto.randomUUID(),
        userId,
        sessionToken,
        userAgent,
        ipAddress,
        expiresAt
    });

    return sessionToken;
}

export async function revokeSession(sessionId: string): Promise<boolean> {
    const session = await db.query.sessions.findFirst({
        where: eq(schema.sessions.id, sessionId)
    });

    if (!session) return false;

    await db
        .update(schema.sessions)
        .set({ revokedAt: new Date() })
        .where(eq(schema.sessions.id, sessionId));

    return true;
}

export async function revokeSessionByToken(
    sessionToken: string
): Promise<boolean> {
    const session = await db.query.sessions.findFirst({
        where: eq(schema.sessions.sessionToken, sessionToken)
    });

    if (!session) return false;

    await db
        .update(schema.sessions)
        .set({ revokedAt: new Date() })
        .where(eq(schema.sessions.sessionToken, sessionToken));

    return true;
}

export async function revokeAllSessions(userId: string): Promise<void> {
    await db
        .update(schema.sessions)
        .set({ revokedAt: new Date() })
        .where(
            and(
                eq(schema.sessions.userId, userId),
                isNull(schema.sessions.revokedAt)
            )
        );
}

export async function getUserSessions(userId: string) {
    return db.query.sessions.findMany({
        where: and(
            eq(schema.sessions.userId, userId),
            isNull(schema.sessions.revokedAt),
            gt(schema.sessions.expiresAt, new Date())
        ),
        columns: {
            id: true,
            userAgent: true,
            ipAddress: true,
            createdAt: true,
            expiresAt: true
        }
    });
}

export async function getUserPermissions(userId: string): Promise<Set<string>> {
    const userGroups = await db.query.userGroups.findMany({
        where: eq(schema.userGroups.userId, userId),
        with: {
            group: true
        }
    });

    const permissions = new Set<string>();

    for (const ug of userGroups) {
        const groupPermissions = await db.query.groupPermissions.findMany({
            where: eq(schema.groupPermissions.groupId, ug.groupId),
            with: {
                permission: true
            }
        });

        for (const gp of groupPermissions) {
            if (gp.permission) {
                permissions.add(gp.permission.name);
            }
        }
    }

    return permissions;
}

export async function isUserBanned(userId: string): Promise<boolean> {
    const ban = await db.query.userBans.findFirst({
        where: and(
            eq(schema.userBans.userId, userId),
            isNull(schema.userBans.liftedAt)
        )
    });

    if (!ban) return false;

    // Check if ban has expired
    if (ban.expiresAt && ban.expiresAt < new Date()) {
        return false;
    }

    return true;
}

/**
 * Checks if a username matches ADMIN_USERNAME and adds them to admin group.
 * Called at registration and server startup.
 */
export async function elevateToAdminIfConfigured(
    userId: string,
    username: string
): Promise<void> {
    if (!config.adminUsername || username !== config.adminUsername) return;

    const adminGroup = await db.query.groups.findFirst({
        where: eq(schema.groups.name, 'admin')
    });

    if (!adminGroup) return;

    // Check if already in admin group
    const existingMembership = await db.query.userGroups.findFirst({
        where: and(
            eq(schema.userGroups.userId, userId),
            eq(schema.userGroups.groupId, adminGroup.id)
        )
    });

    if (existingMembership) return;

    await db.insert(schema.userGroups).values({
        id: crypto.randomUUID(),
        userId,
        groupId: adminGroup.id
    });

    console.log(`Elevated user "${username}" to admin group`);
}

/**
 * Ensures the configured ADMIN_USERNAME user is in the admin group.
 * Called once at server startup.
 */
export async function ensureAdminUser(): Promise<void> {
    if (!config.adminUsername) return;

    const user = await db.query.users.findFirst({
        where: eq(schema.users.username, config.adminUsername)
    });

    if (!user) {
        console.log(
            `ADMIN_USERNAME="${config.adminUsername}" - user will be elevated on registration`
        );
        return;
    }

    await elevateToAdminIfConfigured(user.id, user.username);
}

export function getCookieOptions() {
    return {
        httpOnly: true,
        secure: config.secureCookies,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: SESSION_EXPIRY_MS,
        domain: config.buildEnv === 'local' ? undefined : config.domain
    };
}
