import { randomUUID } from 'node:crypto';
import { db, schema } from '@db/index';
import { eq, and, desc, sql } from 'drizzle-orm';

/**
 * Bookmark a post for the user. Idempotent — a duplicate insert is a no-op
 * because of the (user_id, post_id) unique index. SQLite's `ON CONFLICT
 * DO NOTHING` keeps the call cheap and deterministic.
 */
export async function addBookmark(
  userId: string,
  postId: string
): Promise<void> {
  await db
    .insert(schema.bookmarks)
    .values({
      id: randomUUID(),
      userId,
      postId,
      createdAt: new Date().toISOString()
    })
    .onConflictDoNothing();
}

export async function removeBookmark(
  userId: string,
  postId: string
): Promise<void> {
  await db
    .delete(schema.bookmarks)
    .where(
      and(
        eq(schema.bookmarks.userId, userId),
        eq(schema.bookmarks.postId, postId)
      )
    );
}

export async function isBookmarked(
  userId: string,
  postId: string
): Promise<boolean> {
  const row = await db.query.bookmarks.findFirst({
    where: and(
      eq(schema.bookmarks.userId, userId),
      eq(schema.bookmarks.postId, postId)
    )
  });
  return !!row;
}

export async function listForUser(userId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const rows = await db.query.bookmarks.findMany({
    where: eq(schema.bookmarks.userId, userId),
    orderBy: [desc(schema.bookmarks.createdAt)],
    limit,
    offset,
    with: { post: true }
  });
  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.bookmarks)
    .where(eq(schema.bookmarks.userId, userId));
  return {
    bookmarks: rows.map((r) => ({
      id: r.id,
      slug: r.post?.slug || '',
      title: r.post?.title || '',
      createdAt: r.createdAt
    })),
    total: total[0]?.count || 0
  };
}

/**
 * Most-bookmarked posts — surfaced in admin analytics.
 */
export async function getMostBookmarked(limit: number = 5) {
  return db
    .select({
      slug: schema.posts.slug,
      title: schema.posts.title,
      count: sql<number>`count(${schema.bookmarks.id})`
    })
    .from(schema.posts)
    .innerJoin(schema.bookmarks, eq(schema.bookmarks.postId, schema.posts.id))
    .groupBy(schema.posts.id)
    .orderBy(sql`count(${schema.bookmarks.id}) desc`)
    .limit(limit);
}

export async function countByUser(userId: string): Promise<number> {
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.bookmarks)
    .where(eq(schema.bookmarks.userId, userId));
  return row[0]?.count || 0;
}
