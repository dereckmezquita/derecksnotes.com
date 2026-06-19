import crypto from 'crypto';
import { db, schema } from '@db/index';
import { eq, and, isNull, desc, sql, inArray } from 'drizzle-orm';
import { hashPassword, ensureAdminUser } from './auth';

// `inArray` is already imported above; this file used to redeclare the
// helper inline via raw `sql` template which silently turned the IN-list
// into a single bound parameter. See findUsersByUsernames below.

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

  // ADMIN_USERNAME bootstrap: if the env var matches this registration, elevate.
  // This is how a fresh prod gets its first admin without manual SQL.
  // Case-sensitive exact match; documented in server/.env.example.
  const adminUsername = process.env.ADMIN_USERNAME?.trim();
  if (adminUsername && adminUsername === data.username) {
    await ensureAdminUser(id);
    console.log(
      `[admin-bootstrap] Elevated '${data.username}' to admin (matches ADMIN_USERNAME)`
    );
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

export interface SocialLink {
  label: string;
  url: string;
}

export async function updateProfile(
  userId: string,
  data: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string | null;
    location?: string | null;
    socialLinks?: SocialLink[] | null;
  }
) {
  const patch: Record<string, unknown> = {
    updatedAt: new Date().toISOString()
  };
  if (data.displayName !== undefined) patch.displayName = data.displayName;
  if (data.bio !== undefined) patch.bio = data.bio;
  if (data.avatarUrl !== undefined) patch.avatarUrl = data.avatarUrl;
  if (data.location !== undefined) patch.location = data.location;
  if (data.socialLinks !== undefined)
    patch.socialLinks = data.socialLinks
      ? JSON.stringify(data.socialLinks)
      : null;
  await db.update(schema.users).set(patch).where(eq(schema.users.id, userId));
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

/**
 * Prefix search across username + displayName. Used by the mention
 * autocomplete in <CommentForm>. Capped at 10 so a fat-finger query
 * can't pull the whole table.
 */
export async function searchUsernames(q: string, limit: number = 10) {
  const trimmed = q.trim();
  if (trimmed.length === 0) return [];
  // SQLite LIKE — fast enough at this scale; case-insensitive default.
  const prefix = `${trimmed.replace(/[%_\\]/g, (c) => '\\' + c)}%`;
  const rows = await db
    .select({
      id: schema.users.id,
      username: schema.users.username,
      displayName: schema.users.displayName,
      avatarUrl: schema.users.avatarUrl
    })
    .from(schema.users)
    .where(
      and(
        isNull(schema.users.deletedAt),
        sql`(${schema.users.username} LIKE ${prefix} ESCAPE '\\' OR ${schema.users.displayName} LIKE ${prefix} ESCAPE '\\')`
      )
    )
    .limit(limit);
  return rows;
}

/**
 * Resolve a list of usernames (case-insensitive) to their user records.
 * Used by the mention fan-out. Soft-deleted users are filtered.
 *
 * Earlier this function used `sql\`lower(...) in ${jsArray}\`` which Drizzle
 * binds as ONE parameter, not as an IN-list — every mention silently
 * failed to resolve. The correct form is `inArray()` against a sql
 * lower(column) expression so each candidate is bound separately.
 */
export async function findUsersByUsernames(usernames: string[]) {
  if (usernames.length === 0) return [];
  const lower = usernames.map((u) => u.toLowerCase());
  const rows = await db
    .select({
      id: schema.users.id,
      username: schema.users.username,
      displayName: schema.users.displayName,
      avatarUrl: schema.users.avatarUrl,
      mentionMuted: schema.users.mentionMuted
    })
    .from(schema.users)
    .where(
      and(
        isNull(schema.users.deletedAt),
        inArray(sql`lower(${schema.users.username})`, lower)
      )
    );
  return rows;
}

export async function setMentionMuted(
  userId: string,
  muted: boolean
): Promise<void> {
  await db
    .update(schema.users)
    .set({ mentionMuted: muted ? 1 : 0, updatedAt: new Date().toISOString() })
    .where(eq(schema.users.id, userId));
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
    // Defense-in-depth: even on /me/comments (the user's own list), we
    // serve `[DELETED]` for soft-deleted rows. The client UI also gates
    // on `isDeleted`, but two layers prevents a future API consumer or
    // copy-paste of the response from showing the original content.
    comments: rows.map((c) => ({
      id: c.id,
      content: c.deletedAt ? '[DELETED]' : c.content,
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
  // Single-statement IN-list with the userId + deletedAt guard scopes the
  // soft-delete to the caller's own undeleted comments, atomically, in one
  // round trip. The prior version executed N statements in a loop and
  // mis-reported `deleted` as the input length.
  if (commentIds.length === 0) return 0;
  const now = new Date().toISOString();
  const ids = await db
    .update(schema.comments)
    .set({ deletedAt: now })
    .where(
      and(
        inArray(schema.comments.id, commentIds),
        eq(schema.comments.userId, userId),
        isNull(schema.comments.deletedAt)
      )
    )
    .returning({ id: schema.comments.id });
  return ids.length;
}

/**
 * Public-profile activity feed: the user's recent approved comments + their
 * post reactions, merged and sorted by timestamp desc. Keeps the payload
 * shape small — just enough to render in a list.
 */
export async function getUserActivity(userId: string, limit: number = 30) {
  const commentRows = await db.query.comments.findMany({
    where: and(
      eq(schema.comments.userId, userId),
      eq(schema.comments.approved, 1),
      isNull(schema.comments.deletedAt)
    ),
    orderBy: [desc(schema.comments.createdAt)],
    limit,
    with: { post: true }
  });
  const reactionRows = await db.query.postReactions.findMany({
    where: eq(schema.postReactions.userId, userId),
    orderBy: [desc(schema.postReactions.createdAt)],
    limit,
    with: { post: true }
  });
  const merged = [
    ...commentRows.map((c) => ({
      type: 'comment' as const,
      id: c.id,
      createdAt: c.createdAt,
      slug: c.post?.slug || '',
      postTitle: c.post?.title || '',
      content: c.content
    })),
    ...reactionRows.map((r) => ({
      type: 'reaction' as const,
      id: r.id,
      createdAt: r.createdAt,
      slug: r.post?.slug || '',
      postTitle: r.post?.title || '',
      reaction: r.type as 'like' | 'dislike'
    }))
  ];
  merged.sort((a, b) => (b.createdAt < a.createdAt ? -1 : 1));
  return merged.slice(0, limit);
}

/**
 * Public-profile "top comments" — the user's highest-scored undeleted
 * approved comments, ranked by net (likes − dislikes) desc, ties broken
 * by recency then by id. Pagination is honoured at the SQL layer so the
 * service is constant-cost regardless of how many comments the user has
 * written; the earlier JS-rank-and-slice implementation was bounded to
 * 50 candidates and would silently miss high-karma comments outside that
 * window for prolific users.
 *
 * Drizzle's relational findMany still aliases the reactions sub-query in
 * a way that breaks `commentReactions.type` (see the comment-sort fix), so
 * we keep this as a select() with an explicit LEFT JOIN + GROUP BY which
 * SQLite handles cleanly.
 *
 * Pure-neutral comments (score 0, no likes) are filtered with HAVING so
 * they don't consume page slots; comments with engagement always pass.
 */
export async function getTopComments(
  userId: string,
  page: number = 1,
  limit: number = 5
): Promise<{
  items: Array<{
    id: string;
    slug: string;
    postTitle: string;
    content: string;
    createdAt: string;
    likes: number;
    dislikes: number;
    score: number;
  }>;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}> {
  const offset = Math.max(0, (page - 1) * limit);
  const likesExpr = sql<number>`COALESCE(SUM(CASE WHEN ${schema.commentReactions.type} = 'like' THEN 1 ELSE 0 END), 0)`;
  const dislikesExpr = sql<number>`COALESCE(SUM(CASE WHEN ${schema.commentReactions.type} = 'dislike' THEN 1 ELSE 0 END), 0)`;
  const scoreExpr = sql<number>`(${likesExpr} - ${dislikesExpr})`;
  const havingExpr = sql`${likesExpr} > 0 OR ${scoreExpr} > 0`;

  const rows = await db
    .select({
      id: schema.comments.id,
      content: schema.comments.content,
      createdAt: schema.comments.createdAt,
      postId: schema.comments.postId,
      likes: likesExpr,
      dislikes: dislikesExpr,
      score: scoreExpr
    })
    .from(schema.comments)
    .leftJoin(
      schema.commentReactions,
      eq(schema.commentReactions.commentId, schema.comments.id)
    )
    .where(
      and(
        eq(schema.comments.userId, userId),
        eq(schema.comments.approved, 1),
        isNull(schema.comments.deletedAt)
      )
    )
    .groupBy(schema.comments.id)
    .having(havingExpr)
    .orderBy(
      desc(scoreExpr),
      desc(schema.comments.createdAt),
      desc(schema.comments.id)
    )
    .limit(limit)
    .offset(offset);

  // Resolve post slug + title for the page slice only. Doing this in a
  // second query keeps the GROUP BY shape simple and matches the pattern
  // used elsewhere in this file.
  const postIds = Array.from(new Set(rows.map((r) => r.postId)));
  const postMap = new Map<string, { slug: string; title: string }>();
  if (postIds.length > 0) {
    const posts = await db.query.posts.findMany({
      where: inArray(schema.posts.id, postIds),
      columns: { id: true, slug: true, title: true }
    });
    for (const p of posts) postMap.set(p.id, { slug: p.slug, title: p.title });
  }

  // Aggregate count uses the same HAVING so total reflects only what's
  // actually returnable. A nested SELECT keeps it as one round-trip.
  const totalRow = await db.all<{ total: number }>(sql`
    SELECT COUNT(*) AS total FROM (
      SELECT 1 FROM ${schema.comments} c
      LEFT JOIN ${schema.commentReactions} r ON r.${sql.raw('comment_id')} = c.${sql.raw('id')}
      WHERE c.${sql.raw('user_id')} = ${userId}
        AND c.${sql.raw('approved')} = 1
        AND c.${sql.raw('deleted_at')} IS NULL
      GROUP BY c.${sql.raw('id')}
      HAVING COALESCE(SUM(CASE WHEN r.${sql.raw('type')} = 'like' THEN 1 ELSE 0 END), 0) > 0
        OR (COALESCE(SUM(CASE WHEN r.${sql.raw('type')} = 'like' THEN 1 ELSE 0 END), 0)
            - COALESCE(SUM(CASE WHEN r.${sql.raw('type')} = 'dislike' THEN 1 ELSE 0 END), 0)) > 0
    )
  `);
  const total = Number(totalRow[0]?.total || 0);

  return {
    items: rows.map((r) => ({
      id: r.id,
      slug: postMap.get(r.postId)?.slug || '',
      postTitle: postMap.get(r.postId)?.title || '',
      content: r.content,
      createdAt: r.createdAt,
      likes: Number(r.likes),
      dislikes: Number(r.dislikes),
      score: Number(r.score)
    })),
    total,
    page,
    limit,
    hasMore: offset + rows.length < total
  };
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

/**
 * Wipe the caller's full read history. Used by the Clear button on the
 * /account read-history tab.
 */
export async function clearReadHistory(userId: string): Promise<number> {
  const ids = await db
    .delete(schema.readHistory)
    .where(eq(schema.readHistory.userId, userId))
    .returning({ id: schema.readHistory.id });
  return ids.length;
}

/**
 * Remove read-history entries for a single post slug (all sessions). Hard
 * delete: read history is a personal log, not a moderation artefact.
 */
export async function removeReadHistoryForSlug(
  userId: string,
  slug: string
): Promise<number> {
  const post = await db.query.posts.findFirst({
    where: eq(schema.posts.slug, slug),
    columns: { id: true }
  });
  if (!post) return 0;
  const ids = await db
    .delete(schema.readHistory)
    .where(
      and(
        eq(schema.readHistory.userId, userId),
        eq(schema.readHistory.postId, post.id)
      )
    )
    .returning({ id: schema.readHistory.id });
  return ids.length;
}
