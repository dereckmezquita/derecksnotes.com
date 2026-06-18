import crypto from 'crypto';
import { db, schema } from '@db/index';
import { eq, and, isNull, desc, asc, sql, inArray } from 'drizzle-orm';
import { sanitizeMarkdown } from '@middleware/sanitize';
import * as notificationService from './notifications';
import * as userService from './users';
import { parseMentions, type CommentData } from '@derecksnotes/shared';

export const MAX_DEPTH = 5;

// Typed errors so route handlers can map to HTTP status without sniffing
// the error stack. Replaces the fragile `error.stack?.includes('at')`
// heuristic (I21) which silently coerced every business error to 500.
export class CommentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommentValidationError';
  }
}
export class CommentNotFoundError extends Error {
  constructor(message: string = 'Comment not found') {
    super(message);
    this.name = 'CommentNotFoundError';
  }
}
export class CommentAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommentAuthError';
  }
}

export async function createComment(data: {
  postId: string;
  postSlug: string;
  postTitle: string;
  userId: string;
  content: string;
  parentId?: string;
  autoApprove: boolean;
}): Promise<string> {
  let depth = 0;

  let parentForNotify: { userId: string } | null = null;

  if (data.parentId) {
    const parent = await db.query.comments.findFirst({
      where: eq(schema.comments.id, data.parentId)
    });

    if (!parent) throw new CommentNotFoundError('Parent comment not found');
    if (parent.postId !== data.postId)
      throw new CommentValidationError(
        'Parent comment belongs to different post'
      );
    if (parent.depth >= MAX_DEPTH)
      throw new CommentValidationError(
        `Maximum reply depth of ${MAX_DEPTH} reached`
      );
    depth = parent.depth + 1;
    parentForNotify = { userId: parent.userId };
  }

  const id = crypto.randomUUID();
  const sanitized = sanitizeMarkdown(data.content);

  await db.insert(schema.comments).values({
    id,
    postId: data.postId,
    userId: data.userId,
    parentId: data.parentId || null,
    content: sanitized,
    depth,
    approved: data.autoApprove ? 1 : 0,
    createdAt: new Date().toISOString()
  });

  // If the comment lands in the pending queue, fan-out to every admin and
  // moderator so the queue gets a bell + toast instead of needing a
  // dashboard refresh. The actor is excluded automatically (trusted users
  // would never hit this branch because their comments auto-approve).
  if (!data.autoApprove) {
    try {
      await notificationService.fanToModerators({
        type: 'comment.pending-review',
        actorUserId: data.userId,
        targetType: 'comment',
        targetId: id,
        payload: {
          postSlug: data.postSlug,
          postTitle: data.postTitle,
          preview: sanitized.slice(0, 200)
        }
      });
    } catch (err) {
      console.error(
        '[notifications] failed to fan pending-review notification:',
        err
      );
    }
  }

  // Fan a reply notification. Wrap in its own try so a failure here can't
  // poison the user-visible create-comment response. createNotification
  // already drops the self-reply case.
  if (parentForNotify && data.autoApprove) {
    try {
      await notificationService.createNotification({
        userId: parentForNotify.userId,
        type: 'comment.reply',
        actorUserId: data.userId,
        targetType: 'comment',
        targetId: id,
        payload: {
          postSlug: data.postSlug,
          postTitle: data.postTitle,
          preview: sanitized.slice(0, 200)
        }
      });
    } catch (err) {
      console.error('[notifications] failed to fan reply notification:', err);
    }
  }

  // Fan mention notifications. Resolve all mentioned usernames to user ids
  // in one query; skip muted users (admin-set), the parent author (already
  // got a reply notification), and the commenter themselves.
  if (data.autoApprove) {
    try {
      const usernames = parseMentions(sanitized);
      if (usernames.length > 0) {
        const users = await userService.findUsersByUsernames(usernames);
        const skipIds = new Set<string>([data.userId]);
        if (parentForNotify) skipIds.add(parentForNotify.userId);
        for (const u of users) {
          if (skipIds.has(u.id)) continue;
          if (u.mentionMuted) continue;
          await notificationService.createNotification({
            userId: u.id,
            type: 'mention',
            actorUserId: data.userId,
            targetType: 'comment',
            targetId: id,
            payload: {
              postSlug: data.postSlug,
              postTitle: data.postTitle,
              preview: sanitized.slice(0, 200)
            }
          });
        }
      }
    } catch (err) {
      console.error(
        '[notifications] failed to fan mention notifications:',
        err
      );
    }
  }

  return id;
}

export async function editComment(
  commentId: string,
  userId: string,
  newContent: string
): Promise<void> {
  const comment = await db.query.comments.findFirst({
    where: eq(schema.comments.id, commentId)
  });

  if (!comment) throw new CommentNotFoundError();
  if (comment.userId !== userId)
    throw new CommentAuthError('Not authorized to edit this comment');
  if (comment.deletedAt)
    throw new CommentValidationError('Cannot edit a deleted comment');

  // Save history snapshot of the OLD content
  await db.insert(schema.commentHistory).values({
    id: crypto.randomUUID(),
    commentId,
    content: comment.content,
    editedAt: new Date().toISOString(),
    editedBy: userId
  });

  // Update comment
  const sanitized = sanitizeMarkdown(newContent);
  await db
    .update(schema.comments)
    .set({ content: sanitized, editedAt: new Date().toISOString() })
    .where(eq(schema.comments.id, commentId));
}

export async function softDeleteComment(
  commentId: string,
  userId: string
): Promise<void> {
  const comment = await db.query.comments.findFirst({
    where: eq(schema.comments.id, commentId)
  });

  if (!comment) throw new CommentNotFoundError();
  if (comment.userId !== userId)
    throw new CommentAuthError('Not authorized to delete this comment');
  if (comment.deletedAt)
    throw new CommentValidationError('Comment already deleted');

  await db
    .update(schema.comments)
    .set({ deletedAt: new Date().toISOString() })
    .where(eq(schema.comments.id, commentId));
}

/**
 * Returns the full revision history of a comment, including the current
 * version, ordered newest-first. Returns `null` when the caller is neither
 * the comment's author nor a moderator — the caller maps that to a 403.
 * Returns `[]` when the comment does not exist (matches the prior contract).
 */
export async function getCommentHistory(
  commentId: string,
  callerUserId: string,
  isModerator: boolean
): Promise<Array<{
  id: string;
  content: string;
  editedAt: string;
  editedBy: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}> | null> {
  const comment = await db.query.comments.findFirst({
    where: eq(schema.comments.id, commentId),
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      }
    }
  });

  if (!comment) return [];

  const isAuthor = comment.userId === callerUserId;
  if (!isAuthor && !isModerator) return null;

  const entries = await db.query.commentHistory.findMany({
    where: eq(schema.commentHistory.commentId, commentId),
    orderBy: [desc(schema.commentHistory.editedAt)],
    with: {
      editor: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      }
    }
  });

  const current = {
    id: 'current',
    content: comment.content,
    editedAt: comment.editedAt || comment.createdAt,
    editedBy: comment.user
  };

  return [
    current,
    ...entries.map((e) => ({
      id: e.id,
      content: e.content,
      editedAt: e.editedAt,
      editedBy: e.editor
    }))
  ];
}

export type CommentSort = 'new' | 'top' | 'best';

export async function getCommentsForPost(
  postId: string,
  userId: string | null,
  page: number,
  limit: number,
  maxDepth: number = 3,
  repliesPerLevel: number = 3,
  sort: CommentSort = 'new'
): Promise<{
  comments: CommentData[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}> {
  const offset = (page - 1) * limit;

  // Visibility: approved comments + the requesting user's own unapproved
  // comments. I17: exclude soft-deleted from the top-level page so deleted
  // top-level rows do NOT consume slots and inflate `total`.
  const visibilityFilter = userId
    ? sql`(${schema.comments.approved} = 1 OR ${schema.comments.userId} = ${userId})`
    : eq(schema.comments.approved, 1);

  const topLevelWhere = and(
    eq(schema.comments.postId, postId),
    isNull(schema.comments.parentId),
    isNull(schema.comments.deletedAt),
    visibilityFilter
  );

  // Sort ordering. Pinned always wins; id is the deterministic tiebreaker.
  // For 'top' / 'best' we sort in two phases:
  //  1. fetch the top-level rows by createdAt desc (limit * 3 cap so the
  //     re-sort has enough candidates to surface high-karma comments that
  //     would otherwise sit on later pages),
  //  2. aggregate reactions per row in a single GROUP BY,
  //  3. sort in JS and slice to (offset, limit).
  // Drizzle's relational findMany aliases tables in a way that breaks the
  // sql`(SELECT … FROM comment_reactions WHERE …)` interpolation — its
  // identifier `commentReactions.type` collapses to `comments.type`. Doing
  // the score join outside the relational query sidesteps that bug.

  const baseLimit = sort === 'new' ? limit : Math.max(limit * 3, 60);
  const baseOffset = sort === 'new' ? offset : 0;

  const baseRows = await db.query.comments.findMany({
    where: topLevelWhere,
    orderBy: [
      desc(schema.comments.pinnedAt),
      desc(schema.comments.createdAt),
      asc(schema.comments.id)
    ],
    limit: baseLimit,
    offset: baseOffset,
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      reactions: true
    }
  });

  let topLevel = baseRows;
  if (sort !== 'new' && baseRows.length > 0) {
    const score = (likes: number, dislikes: number): number => {
      if (sort === 'top') return likes - dislikes;
      const n = likes + dislikes;
      if (n === 0) return 0;
      // Wilson lower bound (95% confidence) approximation.
      const p = likes / n;
      return p - 1.96 * Math.sqrt((p * (1 - p)) / n);
    };
    const scored = baseRows.map((c) => {
      const likes = (c.reactions || []).filter((r) => r.type === 'like').length;
      const dislikes = (c.reactions || []).filter(
        (r) => r.type === 'dislike'
      ).length;
      return { c, s: score(likes, dislikes) };
    });
    // Stable sort: pinned first, then by score desc, then by id asc for
    // deterministic tiebreak (matches the asc(id) clause for 'new').
    scored.sort((a, b) => {
      const pa = a.c.pinnedAt ? 1 : 0;
      const pb = b.c.pinnedAt ? 1 : 0;
      if (pa !== pb) return pb - pa;
      if (a.s !== b.s) return b.s - a.s;
      return a.c.id < b.c.id ? -1 : 1;
    });
    topLevel = scored.slice(offset, offset + limit).map((x) => x.c);
  }

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.comments)
    .where(topLevelWhere);

  const totalCount = total[0]?.count || 0;

  // I16: previously formatCommentTree fired a COUNT(*) and a findMany per
  // node, so a 20-row page with depth 3 produced ~800 SQLite round-trips.
  // Now we collect all descendant parent ids in a single sweep (BFS over
  // parentId IN (...)) and group counts/rows in O(1) lookups.
  const allReplyRows = await collectDescendants(
    topLevel.map((c) => c.id),
    maxDepth
  );
  const childrenByParent = groupByParent(allReplyRows);

  const result: CommentData[] = topLevel.map((c) =>
    formatCommentTreeBatched(
      c,
      userId,
      maxDepth,
      repliesPerLevel,
      0,
      childrenByParent
    )
  );

  return {
    comments: result,
    total: totalCount,
    page,
    limit,
    hasMore: offset + limit < totalCount
  };
}

/**
 * Single-query BFS over the descendant tree. Returns every non-deleted
 * comment whose parent chain reaches one of `rootIds`, up to `maxDepth`
 * levels down. Replaces the previous per-node fan-out (I16).
 */
async function collectDescendants(
  rootIds: string[],
  maxDepth: number
): Promise<any[]> {
  if (rootIds.length === 0) return [];
  const collected: any[] = [];
  let frontier = rootIds;
  for (let level = 0; level < maxDepth && frontier.length > 0; level++) {
    const rows = await db.query.comments.findMany({
      where: and(
        inArray(schema.comments.parentId, frontier),
        isNull(schema.comments.deletedAt)
      ),
      orderBy: [asc(schema.comments.createdAt), asc(schema.comments.id)],
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },
        reactions: true
      }
    });
    collected.push(...rows);
    frontier = rows.map((r) => r.id);
  }
  return collected;
}

function groupByParent(rows: any[]): Map<string, any[]> {
  const out = new Map<string, any[]>();
  for (const r of rows) {
    if (!r.parentId) continue;
    const arr = out.get(r.parentId);
    if (arr) arr.push(r);
    else out.set(r.parentId, [r]);
  }
  return out;
}

function formatCommentTreeBatched(
  comment: any,
  userId: string | null,
  maxDepth: number,
  repliesPerLevel: number,
  currentDepth: number,
  childrenByParent: Map<string, any[]>
): CommentData {
  const likes =
    comment.reactions?.filter((r: any) => r.type === 'like').length || 0;
  const dislikes =
    comment.reactions?.filter((r: any) => r.type === 'dislike').length || 0;
  const userReaction = userId
    ? (comment.reactions?.find((r: any) => r.userId === userId)?.type as
        | 'like'
        | 'dislike') || null
    : null;

  const allChildren = childrenByParent.get(comment.id) || [];
  const replyCount = allChildren.length;
  let replies: CommentData[] = [];
  let hasMoreReplies = false;

  if (currentDepth < maxDepth && replyCount > 0) {
    const slice = allChildren.slice(0, repliesPerLevel);
    hasMoreReplies = replyCount > repliesPerLevel;
    replies = slice.map((child) =>
      formatCommentTreeBatched(
        child,
        userId,
        maxDepth,
        repliesPerLevel,
        currentDepth + 1,
        childrenByParent
      )
    );
  } else if (replyCount > 0) {
    hasMoreReplies = true;
  }

  return {
    id: comment.id,
    content: comment.deletedAt ? '[deleted]' : comment.content,
    depth: comment.depth,
    approved: !!comment.approved,
    createdAt: comment.createdAt,
    editedAt: comment.editedAt,
    isDeleted: !!comment.deletedAt,
    user: comment.deletedAt ? null : comment.user,
    reactions: { likes, dislikes, userReaction },
    replies,
    replyCount,
    hasMoreReplies
  };
}

export async function getRepliesForComment(
  commentId: string,
  userId: string | null,
  page: number,
  limit: number,
  maxDepth: number = 3,
  repliesPerLevel: number = 3
): Promise<{ replies: CommentData[]; total: number; hasMore: boolean }> {
  const offset = (page - 1) * limit;

  const replyVisibility = userId
    ? sql`(${schema.comments.approved} = 1 OR ${schema.comments.userId} = ${userId})`
    : eq(schema.comments.approved, 1);

  const childComments = await db.query.comments.findMany({
    where: and(
      eq(schema.comments.parentId, commentId),
      isNull(schema.comments.deletedAt),
      replyVisibility
    ),
    // I18: id tiebreaker for deterministic pagination across boundaries.
    orderBy: [asc(schema.comments.createdAt), asc(schema.comments.id)],
    limit,
    offset,
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      reactions: true
    }
  });

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.comments)
    .where(
      and(
        eq(schema.comments.parentId, commentId),
        isNull(schema.comments.deletedAt)
      )
    );

  const totalCount = total[0]?.count || 0;
  const parent = await db.query.comments.findFirst({
    where: eq(schema.comments.id, commentId)
  });
  const parentDepth = parent?.depth || 0;

  const replies: CommentData[] = [];
  for (const child of childComments) {
    replies.push(
      await formatCommentTree(
        child,
        userId,
        maxDepth,
        repliesPerLevel,
        parentDepth + 1
      )
    );
  }

  return { replies, total: totalCount, hasMore: offset + limit < totalCount };
}

async function formatCommentTree(
  comment: any,
  userId: string | null,
  maxDepth: number,
  repliesPerLevel: number,
  currentDepth: number = 0
): Promise<CommentData> {
  const likes =
    comment.reactions?.filter((r: any) => r.type === 'like').length || 0;
  const dislikes =
    comment.reactions?.filter((r: any) => r.type === 'dislike').length || 0;
  const userReaction = userId
    ? (comment.reactions?.find((r: any) => r.userId === userId)?.type as
        | 'like'
        | 'dislike') || null
    : null;

  let replies: CommentData[] = [];
  let replyCount = 0;
  let hasMoreReplies = false;

  // Always get the total count of replies
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.comments)
    .where(
      and(
        eq(schema.comments.parentId, comment.id),
        isNull(schema.comments.deletedAt)
      )
    );
  replyCount = countResult[0]?.count || 0;

  if (currentDepth < maxDepth && replyCount > 0) {
    const childComments = await db.query.comments.findMany({
      where: and(
        eq(schema.comments.parentId, comment.id),
        isNull(schema.comments.deletedAt)
      ),
      orderBy: [asc(schema.comments.createdAt)],
      limit: repliesPerLevel,
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },
        reactions: true
      }
    });

    hasMoreReplies = replyCount > repliesPerLevel;
    for (const child of childComments) {
      replies.push(
        await formatCommentTree(
          child,
          userId,
          maxDepth,
          repliesPerLevel,
          currentDepth + 1
        )
      );
    }
  } else if (replyCount > 0) {
    hasMoreReplies = true;
  }

  return {
    id: comment.id,
    content: comment.deletedAt ? '[deleted]' : comment.content,
    depth: comment.depth,
    approved: !!comment.approved,
    createdAt: comment.createdAt,
    editedAt: comment.editedAt,
    isDeleted: !!comment.deletedAt,
    user: comment.deletedAt ? null : comment.user,
    reactions: { likes, dislikes, userReaction },
    replies,
    replyCount,
    hasMoreReplies
  };
}

export async function reactToComment(
  commentId: string,
  userId: string,
  type: 'like' | 'dislike'
): Promise<{
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
}> {
  // I14: wrap the read-modify-write in an IMMEDIATE transaction so concurrent
  // double-clicks can't end with mismatched state.
  let becameNewLike = false;
  await db.transaction(async (tx) => {
    const existing = await tx.query.commentReactions.findFirst({
      where: and(
        eq(schema.commentReactions.commentId, commentId),
        eq(schema.commentReactions.userId, userId)
      )
    });

    if (existing) {
      if (existing.type === type) {
        await tx
          .delete(schema.commentReactions)
          .where(eq(schema.commentReactions.id, existing.id));
      } else {
        await tx
          .update(schema.commentReactions)
          .set({ type })
          .where(eq(schema.commentReactions.id, existing.id));
        if (type === 'like') becameNewLike = true;
      }
    } else {
      await tx.insert(schema.commentReactions).values({
        id: crypto.randomUUID(),
        commentId,
        userId,
        type,
        createdAt: new Date().toISOString()
      });
      if (type === 'like') becameNewLike = true;
    }
  });

  // Fan a like notification when the reaction transitions to like
  // (initial insert or dislike → like). Skip on dislikes — those are noise.
  if (becameNewLike) {
    try {
      const comment = await db.query.comments.findFirst({
        where: eq(schema.comments.id, commentId),
        columns: { userId: true, content: true },
        with: { post: true }
      });
      if (comment) {
        await notificationService.createNotification({
          userId: comment.userId,
          type: 'comment.like',
          actorUserId: userId,
          targetType: 'comment',
          targetId: commentId,
          payload: {
            postSlug: comment.post?.slug || '',
            postTitle: comment.post?.title || '',
            preview: (comment.content || '').slice(0, 200)
          }
        });
      }
    } catch (err) {
      console.error('[notifications] failed to fan like notification:', err);
    }
  }

  return getCommentReactions(commentId, userId);
}

export async function removeCommentReaction(commentId: string, userId: string) {
  await db
    .delete(schema.commentReactions)
    .where(
      and(
        eq(schema.commentReactions.commentId, commentId),
        eq(schema.commentReactions.userId, userId)
      )
    );

  return getCommentReactions(commentId, null);
}

async function getCommentReactions(commentId: string, userId: string | null) {
  const likes = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.commentReactions)
    .where(
      and(
        eq(schema.commentReactions.commentId, commentId),
        eq(schema.commentReactions.type, 'like')
      )
    );

  const dislikes = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.commentReactions)
    .where(
      and(
        eq(schema.commentReactions.commentId, commentId),
        eq(schema.commentReactions.type, 'dislike')
      )
    );

  let userReaction: 'like' | 'dislike' | null = null;
  if (userId) {
    const r = await db.query.commentReactions.findFirst({
      where: and(
        eq(schema.commentReactions.commentId, commentId),
        eq(schema.commentReactions.userId, userId)
      )
    });
    userReaction = (r?.type as 'like' | 'dislike') || null;
  }

  return {
    likes: likes[0]?.count || 0,
    dislikes: dislikes[0]?.count || 0,
    userReaction
  };
}

export async function approveComment(commentId: string): Promise<void> {
  await db
    .update(schema.comments)
    .set({ approved: 1 })
    .where(eq(schema.comments.id, commentId));
}

export async function rejectComment(commentId: string): Promise<void> {
  await db
    .update(schema.comments)
    .set({ deletedAt: new Date().toISOString() })
    .where(eq(schema.comments.id, commentId));
}

export async function getPendingComments(page: number, limit: number) {
  const offset = (page - 1) * limit;

  const rows = await db.query.comments.findMany({
    where: and(
      eq(schema.comments.approved, 0),
      isNull(schema.comments.deletedAt)
    ),
    // Oldest first so moderation queue is FIFO.
    orderBy: [asc(schema.comments.createdAt), asc(schema.comments.id)],
    limit,
    offset,
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          createdAt: true
        }
      },
      post: true,
      reactions: true
    }
  });

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.comments)
    .where(
      and(eq(schema.comments.approved, 0), isNull(schema.comments.deletedAt))
    );

  // Batch the per-author reputation aggregates so the queue stays O(1) DB
  // round-trips regardless of page size.
  const authorIds = Array.from(
    new Set(rows.map((c) => c.userId).filter((id): id is string => !!id))
  );

  const reputationByUser = new Map<
    string,
    {
      totalComments: number;
      approvedCount: number;
      pendingCount: number;
      rejectedCount: number;
      totalLikesReceived: number;
      totalDislikesReceived: number;
      groups: string[];
    }
  >();

  if (authorIds.length > 0) {
    const commentCounts = await db
      .select({
        userId: schema.comments.userId,
        total: sql<number>`count(*)`,
        approved: sql<number>`sum(case when ${schema.comments.approved} = 1 then 1 else 0 end)`,
        pending: sql<number>`sum(case when ${schema.comments.approved} = 0 and ${schema.comments.deletedAt} is null then 1 else 0 end)`,
        rejected: sql<number>`sum(case when ${schema.comments.approved} = 0 and ${schema.comments.deletedAt} is not null then 1 else 0 end)`
      })
      .from(schema.comments)
      .where(inArray(schema.comments.userId, authorIds))
      .groupBy(schema.comments.userId);

    const reactionTotals = await db
      .select({
        userId: schema.comments.userId,
        likes: sql<number>`sum(case when ${schema.commentReactions.type} = 'like' then 1 else 0 end)`,
        dislikes: sql<number>`sum(case when ${schema.commentReactions.type} = 'dislike' then 1 else 0 end)`
      })
      .from(schema.commentReactions)
      .innerJoin(
        schema.comments,
        eq(schema.commentReactions.commentId, schema.comments.id)
      )
      .where(inArray(schema.comments.userId, authorIds))
      .groupBy(schema.comments.userId);

    const groupRows = await db.query.userGroups.findMany({
      where: inArray(schema.userGroups.userId, authorIds),
      with: { group: true }
    });

    const groupsByUser = new Map<string, string[]>();
    for (const g of groupRows) {
      const list = groupsByUser.get(g.userId);
      if (list) list.push(g.group.name);
      else groupsByUser.set(g.userId, [g.group.name]);
    }

    const reactionsByUser = new Map(reactionTotals.map((r) => [r.userId, r]));

    for (const c of commentCounts) {
      const reactions = reactionsByUser.get(c.userId);
      reputationByUser.set(c.userId, {
        totalComments: c.total || 0,
        approvedCount: c.approved || 0,
        pendingCount: c.pending || 0,
        rejectedCount: c.rejected || 0,
        totalLikesReceived: reactions?.likes || 0,
        totalDislikesReceived: reactions?.dislikes || 0,
        groups: groupsByUser.get(c.userId) || []
      });
    }
  }

  const now = Date.now();

  return {
    comments: rows.map((c) => {
      const reactions = c.reactions || [];
      const commentLikes = reactions.filter((r) => r.type === 'like').length;
      const commentDislikes = reactions.filter(
        (r) => r.type === 'dislike'
      ).length;
      const rep = c.userId ? reputationByUser.get(c.userId) : undefined;
      const authorAccountAgeDays = c.user?.createdAt
        ? Math.max(
            0,
            Math.floor(
              (now - new Date(c.user.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 0;
      return {
        id: c.id,
        content: c.content,
        slug: c.post?.slug || '',
        postTitle: c.post?.title || '',
        createdAt: c.createdAt,
        user: c.user
          ? {
              id: c.user.id,
              username: c.user.username,
              displayName: c.user.displayName,
              avatarUrl: c.user.avatarUrl
            }
          : null,
        commentLikes,
        commentDislikes,
        authorAccountAgeDays,
        authorTotalComments: rep?.totalComments ?? 0,
        authorApprovedCount: rep?.approvedCount ?? 0,
        authorPendingCount: rep?.pendingCount ?? 0,
        authorRejectedCount: rep?.rejectedCount ?? 0,
        authorTotalLikesReceived: rep?.totalLikesReceived ?? 0,
        authorTotalDislikesReceived: rep?.totalDislikesReceived ?? 0,
        authorGroups: rep?.groups ?? []
      };
    }),
    total: total[0]?.count || 0
  };
}
