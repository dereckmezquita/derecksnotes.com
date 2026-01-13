import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db, schema } from '../db';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { secrets, config } from '../lib/env';
import type { TokenPayload } from '../types';

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
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

export function generateAccessToken(userId: string, username: string): string {
    const payload: TokenPayload = {
        userId,
        username,
        type: 'access'
    };
    return jwt.sign(payload, secrets.sessionSecret, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    });
}

export function generateRefreshToken(userId: string, username: string): string {
    const payload: TokenPayload = {
        userId,
        username,
        type: 'refresh'
    };
    return jwt.sign(payload, secrets.sessionSecret, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, secrets.sessionSecret) as TokenPayload;
    } catch {
        return null;
    }
}

export async function createSession(
    userId: string,
    username: string,
    userAgent?: string,
    ipAddress?: string
): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = generateAccessToken(userId, username);
    const refreshToken = generateRefreshToken(userId, username);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

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
        refreshToken,
        userAgent,
        ipAddress,
        expiresAt
    });

    return { accessToken, refreshToken };
}

export async function refreshSession(
    refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
    const payload = verifyToken(refreshToken);
    if (!payload || payload.type !== 'refresh') {
        return null;
    }

    // Find the session
    const session = await db.query.sessions.findFirst({
        where: and(
            eq(schema.sessions.refreshToken, refreshToken),
            isNull(schema.sessions.revokedAt),
            gt(schema.sessions.expiresAt, new Date())
        )
    });

    if (!session) {
        return null;
    }

    // Get user
    const user = await db.query.users.findFirst({
        where: and(
            eq(schema.users.id, session.userId),
            isNull(schema.users.deletedAt)
        )
    });

    if (!user) {
        return null;
    }

    // Revoke old session
    await db
        .update(schema.sessions)
        .set({ revokedAt: new Date() })
        .where(eq(schema.sessions.id, session.id));

    // Create new session
    return createSession(
        user.id,
        user.username,
        session.userAgent || undefined,
        session.ipAddress || undefined
    );
}

export async function revokeSession(sessionId: string): Promise<boolean> {
    const result = await db
        .update(schema.sessions)
        .set({ revokedAt: new Date() })
        .where(eq(schema.sessions.id, sessionId));

    return result.changes > 0;
}

export async function revokeAllSessions(
    userId: string,
    exceptSessionId?: string
): Promise<void> {
    if (exceptSessionId) {
        await db
            .update(schema.sessions)
            .set({ revokedAt: new Date() })
            .where(
                and(
                    eq(schema.sessions.userId, userId),
                    isNull(schema.sessions.revokedAt)
                )
            );
    } else {
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

export function getCookieOptions(isRefreshToken = false) {
    return {
        httpOnly: true,
        secure: config.secureCookies,
        sameSite: 'lax' as const,
        path: isRefreshToken ? '/api/v1/auth/refresh' : '/',
        maxAge: isRefreshToken ? REFRESH_TOKEN_EXPIRY_MS : 15 * 60 * 1000,
        domain: config.buildEnv === 'local' ? undefined : config.domain
    };
}
