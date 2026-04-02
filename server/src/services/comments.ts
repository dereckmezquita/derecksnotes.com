import crypto from 'crypto';
import { db, schema } from '@db/index';
import { eq, and, isNull, desc, asc, sql } from 'drizzle-orm';
import { sanitizeMarkdown } from '@middleware/sanitize';
import type { CommentData } from '@derecksnotes/shared';

const MAX_DEPTH = 5;

export async function createComment(data: {
    postId: string;
    userId: string;
    content: string;
    parentId?: string;
    autoApprove: boolean;
}): Promise<string> {
    let depth = 0;

    if (data.parentId) {
        const parent = await db.query.comments.findFirst({
            where: eq(schema.comments.id, data.parentId)
        });

        if (!parent) throw new Error('Parent comment not found');
        if (parent.postId !== data.postId)
            throw new Error('Parent comment belongs to different post');
        if (parent.depth >= MAX_DEPTH)
            throw new Error(`Maximum reply depth of ${MAX_DEPTH} reached`);
        depth = parent.depth + 1;
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

    if (!comment) throw new Error('Comment not found');
    if (comment.userId !== userId)
        throw new Error('Not authorized to edit this comment');
    if (comment.deletedAt) throw new Error('Cannot edit a deleted comment');

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

    if (!comment) throw new Error('Comment not found');
    if (comment.userId !== userId)
        throw new Error('Not authorized to delete this comment');
    if (comment.deletedAt) throw new Error('Comment already deleted');

    await db
        .update(schema.comments)
        .set({ deletedAt: new Date().toISOString() })
        .where(eq(schema.comments.id, commentId));
}

export async function getCommentHistory(commentId: string) {
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

    // Also include the current version
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

export async function getCommentsForPost(
    postId: string,
    userId: string | null,
    page: number,
    limit: number,
    maxDepth: number = 3,
    repliesPerLevel: number = 3
): Promise<{
    comments: CommentData[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}> {
    const offset = (page - 1) * limit;

    const topLevel = await db.query.comments.findMany({
        where: and(
            eq(schema.comments.postId, postId),
            isNull(schema.comments.parentId)
        ),
        orderBy: [
            desc(schema.comments.pinnedAt),
            desc(schema.comments.createdAt)
        ],
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
                eq(schema.comments.postId, postId),
                isNull(schema.comments.parentId)
            )
        );

    const totalCount = total[0]?.count || 0;

    const result: CommentData[] = [];
    for (const comment of topLevel) {
        result.push(
            await formatCommentTree(
                comment,
                userId,
                maxDepth,
                repliesPerLevel,
                0
            )
        );
    }

    return {
        comments: result,
        total: totalCount,
        page,
        limit,
        hasMore: offset + limit < totalCount
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

    const childComments = await db.query.comments.findMany({
        where: and(
            eq(schema.comments.parentId, commentId),
            isNull(schema.comments.deletedAt)
        ),
        orderBy: [asc(schema.comments.createdAt)],
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
    const existing = await db.query.commentReactions.findFirst({
        where: and(
            eq(schema.commentReactions.commentId, commentId),
            eq(schema.commentReactions.userId, userId)
        )
    });

    if (existing) {
        if (existing.type === type) {
            await db
                .delete(schema.commentReactions)
                .where(eq(schema.commentReactions.id, existing.id));
        } else {
            await db
                .update(schema.commentReactions)
                .set({ type })
                .where(eq(schema.commentReactions.id, existing.id));
        }
    } else {
        await db.insert(schema.commentReactions).values({
            id: crypto.randomUUID(),
            commentId,
            userId,
            type,
            createdAt: new Date().toISOString()
        });
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
        orderBy: [asc(schema.comments.createdAt)],
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
            post: true
        }
    });

    const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.comments)
        .where(
            and(
                eq(schema.comments.approved, 0),
                isNull(schema.comments.deletedAt)
            )
        );

    return {
        comments: rows.map((c) => ({
            id: c.id,
            content: c.content,
            slug: c.post?.slug || '',
            postTitle: c.post?.title || '',
            createdAt: c.createdAt,
            user: c.user
        })),
        total: total[0]?.count || 0
    };
}
