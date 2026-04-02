import crypto from 'crypto';
import { db, schema } from '@db/index';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import { hashPassword } from './auth';

export async function createUser(data: {
    username: string;
    password: string;
    email?: string;
}): Promise<{ id: string; username: string }> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const passwordHash = await hashPassword(data.password);

    await db.insert(schema.users).values({
        id,
        username: data.username,
        email: data.email || null,
        passwordHash,
        createdAt: now,
        updatedAt: now
    });

    // Assign default group
    const defaultGroup = await db.query.groups.findFirst({
        where: eq(schema.groups.isDefault, 1)
    });

    if (defaultGroup) {
        await db.insert(schema.userGroups).values({
            id: crypto.randomUUID(),
            userId: id,
            groupId: defaultGroup.id
        });
    }

    return { id, username: data.username };
}

export async function findUserByUsername(username: string) {
    return db.query.users.findFirst({
        where: and(
            eq(schema.users.username, username),
            isNull(schema.users.deletedAt)
        )
    });
}

export async function findUserById(id: string) {
    return db.query.users.findFirst({
        where: and(eq(schema.users.id, id), isNull(schema.users.deletedAt))
    });
}

export async function updateProfile(
    userId: string,
    data: { displayName?: string; bio?: string; avatarUrl?: string | null }
) {
    await db
        .update(schema.users)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(schema.users.id, userId));

    return findUserById(userId);
}

export async function changeUsername(
    userId: string,
    newUsername: string
): Promise<void> {
    await db
        .update(schema.users)
        .set({ username: newUsername, updatedAt: new Date().toISOString() })
        .where(eq(schema.users.id, userId));
}

export async function changePassword(
    userId: string,
    newPasswordHash: string
): Promise<void> {
    await db
        .update(schema.users)
        .set({
            passwordHash: newPasswordHash,
            updatedAt: new Date().toISOString()
        })
        .where(eq(schema.users.id, userId));
}

export async function softDeleteUser(userId: string): Promise<void> {
    await db
        .update(schema.users)
        .set({ deletedAt: new Date().toISOString() })
        .where(eq(schema.users.id, userId));
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
    const existing = await db.query.users.findFirst({
        where: eq(schema.users.username, username)
    });
    return !existing;
}

export async function getUserComments(
    userId: string,
    page: number,
    limit: number
) {
    const offset = (page - 1) * limit;

    const rows = await db.query.comments.findMany({
        where: eq(schema.comments.userId, userId),
        orderBy: [desc(schema.comments.createdAt)],
        limit,
        offset,
        with: {
            post: true,
            reactions: true
        }
    });

    const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.comments)
        .where(eq(schema.comments.userId, userId));

    return {
        comments: rows.map((c) => ({
            id: c.id,
            content: c.content,
            slug: c.post?.slug || '',
            postTitle: c.post?.title || '',
            depth: c.depth,
            approved: !!c.approved,
            createdAt: c.createdAt,
            editedAt: c.editedAt,
            isDeleted: !!c.deletedAt,
            likes: c.reactions.filter((r) => r.type === 'like').length,
            dislikes: c.reactions.filter((r) => r.type === 'dislike').length
        })),
        total: total[0]?.count || 0
    };
}

export async function bulkDeleteComments(
    userId: string,
    commentIds: string[]
): Promise<number> {
    let deleted = 0;
    const now = new Date().toISOString();

    for (const id of commentIds) {
        const result = await db
            .update(schema.comments)
            .set({ deletedAt: now })
            .where(
                and(
                    eq(schema.comments.id, id),
                    eq(schema.comments.userId, userId),
                    isNull(schema.comments.deletedAt)
                )
            );

        deleted++;
    }

    return deleted;
}

export async function getReadHistory(
    userId: string,
    page: number,
    limit: number
) {
    const offset = (page - 1) * limit;

    const rows = await db.query.readHistory.findMany({
        where: eq(schema.readHistory.userId, userId),
        orderBy: [desc(schema.readHistory.readAt)],
        limit,
        offset,
        with: { post: true }
    });

    const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.readHistory)
        .where(eq(schema.readHistory.userId, userId));

    return {
        entries: rows.map((r) => ({
            postSlug: r.post?.slug || '',
            postTitle: r.post?.title || '',
            readAt: r.readAt
        })),
        total: total[0]?.count || 0
    };
}
