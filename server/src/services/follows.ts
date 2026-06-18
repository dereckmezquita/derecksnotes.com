import { randomUUID } from 'node:crypto';
import { db, schema } from '@db/index';
import { eq, and, desc, sql, inArray, isNull } from 'drizzle-orm';

/**
 * Follow another user. Self-follow is silently dropped. Duplicate is a no-op
 * via the (follower, followed) unique index + ON CONFLICT DO NOTHING.
 */
export async function follow(
  followerId: string,
  followedId: string
): Promise<void> {
  if (followerId === followedId) return;
  await db
    .insert(schema.follows)
    .values({
      id: randomUUID(),
      followerId,
      followedId,
      createdAt: new Date().toISOString()
    })
    .onConflictDoNothing();
}

export async function unfollow(
  followerId: string,
  followedId: string
): Promise<void> {
  await db
    .delete(schema.follows)
    .where(
      and(
        eq(schema.follows.followerId, followerId),
        eq(schema.follows.followedId, followedId)
      )
    );
}

export async function isFollowing(
  followerId: string,
  followedId: string
): Promise<boolean> {
  const row = await db.query.follows.findFirst({
    where: and(
      eq(schema.follows.followerId, followerId),
      eq(schema.follows.followedId, followedId)
    )
  });
  return !!row;
}

export async function followerCount(userId: string): Promise<number> {
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.follows)
    .where(eq(schema.follows.followedId, userId));
  return row[0]?.count || 0;
}

export async function followingCount(userId: string): Promise<number> {
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.follows)
    .where(eq(schema.follows.followerId, userId));
  return row[0]?.count || 0;
}

/**
 * IDs that the user follows. Drives the following-feed query.
 */
export async function followingIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ followedId: schema.follows.followedId })
    .from(schema.follows)
    .where(eq(schema.follows.followerId, userId));
  return rows.map((r) => r.followedId);
}

/**
 * Recent comments (last 50) by users that `userId` follows. Joins post for
 * slug + title. Returns approved + non-deleted only — moderation queue
 * never leaks via the feed.
 */
export async function followingFeed(userId: string, limit: number = 30) {
  const ids = await followingIds(userId);
  if (ids.length === 0) return [];
  const rows = await db.query.comments.findMany({
    where: and(
      inArray(schema.comments.userId, ids),
      eq(schema.comments.approved, 1),
      isNull(schema.comments.deletedAt)
    ),
    orderBy: [desc(schema.comments.createdAt)],
    limit,
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      post: true
    }
  });
  return rows.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    user: c.user,
    slug: c.post?.slug || '',
    postTitle: c.post?.title || ''
  }));
}
