import crypto from 'crypto';
import { db, schema } from '@db/index';
import { eq, and, sql } from 'drizzle-orm';

export async function getOrCreatePost(
    slug: string,
    title: string
): Promise<string> {
    const existing = await db.query.posts.findFirst({
        where: eq(schema.posts.slug, slug)
    });

    if (existing) return existing.id;

    const id = crypto.randomUUID();
    await db.insert(schema.posts).values({
        id,
        slug,
        title,
        createdAt: new Date().toISOString()
    });

    return id;
}

export async function reactToPost(
    postId: string,
    userId: string,
    type: 'like' | 'dislike'
): Promise<{
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
}> {
    const existing = await db.query.postReactions.findFirst({
        where: and(
            eq(schema.postReactions.postId, postId),
            eq(schema.postReactions.userId, userId)
        )
    });

    if (existing) {
        if (existing.type === type) {
            // Toggle off
            await db
                .delete(schema.postReactions)
                .where(eq(schema.postReactions.id, existing.id));
        } else {
            // Switch reaction
            await db
                .update(schema.postReactions)
                .set({ type })
                .where(eq(schema.postReactions.id, existing.id));
        }
    } else {
        await db.insert(schema.postReactions).values({
            id: crypto.randomUUID(),
            postId,
            userId,
            type,
            createdAt: new Date().toISOString()
        });
    }

    return getPostStats(postId, userId);
}

export async function removePostReaction(
    postId: string,
    userId: string
): Promise<{ likes: number; dislikes: number; userReaction: null }> {
    await db
        .delete(schema.postReactions)
        .where(
            and(
                eq(schema.postReactions.postId, postId),
                eq(schema.postReactions.userId, userId)
            )
        );

    const stats = await getPostStats(postId, null);
    return { ...stats, userReaction: null };
}

export async function getPostStats(
    postId: string,
    userId: string | null
): Promise<{
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
}> {
    const likes = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.postReactions)
        .where(
            and(
                eq(schema.postReactions.postId, postId),
                eq(schema.postReactions.type, 'like')
            )
        );

    const dislikes = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.postReactions)
        .where(
            and(
                eq(schema.postReactions.postId, postId),
                eq(schema.postReactions.type, 'dislike')
            )
        );

    let userReaction: 'like' | 'dislike' | null = null;
    if (userId) {
        const reaction = await db.query.postReactions.findFirst({
            where: and(
                eq(schema.postReactions.postId, postId),
                eq(schema.postReactions.userId, userId)
            )
        });
        userReaction = (reaction?.type as 'like' | 'dislike') || null;
    }

    return {
        likes: likes[0]?.count || 0,
        dislikes: dislikes[0]?.count || 0,
        userReaction
    };
}

export async function markPostRead(
    userId: string,
    postId: string
): Promise<void> {
    const now = new Date().toISOString();
    const existing = await db.query.readHistory.findFirst({
        where: and(
            eq(schema.readHistory.userId, userId),
            eq(schema.readHistory.postId, postId)
        )
    });

    if (existing) {
        await db
            .update(schema.readHistory)
            .set({ readAt: now })
            .where(eq(schema.readHistory.id, existing.id));
    } else {
        await db.insert(schema.readHistory).values({
            id: crypto.randomUUID(),
            userId,
            postId,
            readAt: now
        });
    }
}

export async function findPostBySlug(slug: string) {
    return db.query.posts.findFirst({ where: eq(schema.posts.slug, slug) });
}
