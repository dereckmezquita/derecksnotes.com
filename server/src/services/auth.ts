import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { db, schema } from '@db/index';
import { eq, and, desc } from 'drizzle-orm';
import { config } from '@lib/env';

const SALT_ROUNDS = 12;
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_SESSIONS_PER_USER = 5;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ id: string; token: string; expiresAt: string }> {
  const id = crypto.randomUUID();
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_EXPIRY_MS).toISOString();

  // Enforce max sessions — revoke oldest if at limit
  const existingSessions = await db.query.sessions.findMany({
    where: eq(schema.sessions.userId, userId),
    orderBy: [desc(schema.sessions.createdAt)]
  });

  if (existingSessions.length >= MAX_SESSIONS_PER_USER) {
    const toRevoke = existingSessions.slice(MAX_SESSIONS_PER_USER - 1);
    for (const s of toRevoke) {
      await db.delete(schema.sessions).where(eq(schema.sessions.id, s.id));
    }
  }

  await db.insert(schema.sessions).values({
    id,
    userId,
    token,
    userAgent: userAgent || null,
    ipAddress: ipAddress || null,
    createdAt: now.toISOString(),
    expiresAt
  });

  return { id, token, expiresAt };
}

export async function revokeSession(sessionId: string): Promise<void> {
  await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
}

export async function getUserWithGroupsAndPermissions(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId)
  });

  if (!user) return null;

  const userGroupRows = await db.query.userGroups.findMany({
    where: eq(schema.userGroups.userId, userId),
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

  const groups: string[] = [];
  const permissions = new Set<string>();

  for (const ug of userGroupRows) {
    groups.push(ug.group.name);
    for (const gp of ug.group.groupPermissions) {
      permissions.add(gp.permission.name);
    }
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    groups,
    permissions: Array.from(permissions)
  };
}

export async function ensureAdminUser(userId: string): Promise<void> {
  const adminGroup = await db.query.groups.findFirst({
    where: eq(schema.groups.name, 'admin')
  });

  if (!adminGroup) return;

  const existing = await db.query.userGroups.findFirst({
    where: and(
      eq(schema.userGroups.userId, userId),
      eq(schema.userGroups.groupId, adminGroup.id)
    )
  });

  if (!existing) {
    await db.insert(schema.userGroups).values({
      id: crypto.randomUUID(),
      userId,
      groupId: adminGroup.id
    });
  }
}

export function isAutoApproveGroup(groups: string[]): boolean {
  return groups.some((g) => ['trusted', 'moderator', 'admin'].includes(g));
}
