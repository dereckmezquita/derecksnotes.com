import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { db, schema } from '../../db';
import { eq, and, isNull, or, sql, desc, asc, count } from 'drizzle-orm';
import {
    authenticate,
    optionalAuth,
    requirePermission
} from '../../middleware/auth';
import { commentLimiter } from '../../middleware/rateLimit';
import { getUserPermissions } from '../../services/auth';
import type { AuthenticatedRequest } from '../../types';

const router = Router();

const MAX_DEPTH = 5;

// Pagination defaults
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_MAX_DEPTH = 3;
const DEFAULT_REPLIES_PER_LEVEL = 5;

// Validation schemas
const createCommentSchema = z.object({
    postSlug: z.string().min(1, 'Post slug is required'),
    content: z
        .string()
        .min(1, 'Content cannot be empty')
        .max(10000, 'Content must be at most 10000 characters'),
    parentId: z.string().uuid().optional()
});

const updateCommentSchema = z.object({
    content: z
        .string()
        .min(1, 'Content cannot be empty')
        .max(10000, 'Content must be at most 10000 characters')
});

// All comments require admin approval - no auto-approve
async function shouldAutoApprove(_userId: string): Promise<boolean> {
    // All comments go to pending, regardless of user group
    return false;
}

// Valid sort options
type SortOption = 'newest' | 'oldest' | 'most_liked' | 'most_discussed';

// Helper to format comment with reactions count
function formatComment(
    comment: typeof schema.comments.$inferSelect & {
        user?: {
            id: string;
            username: string;
            displayName: string | null;
            avatarUrl: string | null;
        };
        reactions?: Array<{ type: string }>;
    },
    currentUserId?: string,
    userReaction?: { type: string } | null,
    totalReplies?: number,
    hasMoreReplies?: boolean
) {
    const reactions = comment.reactions || [];
    const likes = reactions.filter((r) => r.type === 'like').length;
    const dislikes = reactions.filter((r) => r.type === 'dislike').length;

    return {
        id: comment.id,
        postSlug: comment.postSlug,
        parentId: comment.parentId,
        content: comment.deletedAt ? '[deleted]' : comment.content,
        depth: comment.depth,
        approved: comment.approved,
        isPinned: !!comment.pinnedAt,
        pinnedAt: comment.pinnedAt,
        createdAt: comment.createdAt,
        editedAt: comment.editedAt,
        isDeleted: !!comment.deletedAt,
        isOwner: currentUserId === comment.userId,
        user: comment.user
            ? {
                  id: comment.user.id,
                  username: comment.user.username,
                  displayName: comment.user.displayName,
                  avatarUrl: comment.user.avatarUrl
              }
            : null,
        reactions: {
            likes,
            dislikes,
            userReaction: userReaction?.type || null
        },
        totalReplies: totalReplies ?? 0,
        hasMoreReplies: hasMoreReplies ?? false
    };
}

// GET /api/v1/comments?postSlug=xxx&page=1&limit=20&maxDepth=3&repliesPerLevel=5&sort=newest
router.get(
    '/',
    optionalAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { postSlug } = req.query;
            const page = Math.max(
                1,
                parseInt(req.query.page as string) || DEFAULT_PAGE
            );
            const limit = Math.min(
                50,
                Math.max(
                    1,
                    parseInt(req.query.limit as string) || DEFAULT_LIMIT
                )
            );
            const maxDepth = Math.min(
                MAX_DEPTH,
                Math.max(
                    0,
                    parseInt(req.query.maxDepth as string) || DEFAULT_MAX_DEPTH
                )
            );
            const repliesPerLevel = Math.min(
                20,
                Math.max(
                    1,
                    parseInt(req.query.repliesPerLevel as string) ||
                        DEFAULT_REPLIES_PER_LEVEL
                )
            );
            const sortParam = req.query.sort as string;
            const validSorts: SortOption[] = [
                'newest',
                'oldest',
                'most_liked',
                'most_discussed'
            ];
            const sort: SortOption = validSorts.includes(
                sortParam as SortOption
            )
                ? (sortParam as SortOption)
                : 'newest';

            if (!postSlug || typeof postSlug !== 'string') {
                res.status(400).json({
                    error: 'postSlug query parameter is required'
                });
                return;
            }

            // Check if user can view unapproved comments
            let canViewUnapproved = false;
            if (req.user) {
                const permissions = await getUserPermissions(req.user.id);
                canViewUnapproved = permissions.has('comment.view.unapproved');
            }

            // Build base where clause for visibility
            const visibilityClause = canViewUnapproved
                ? sql`1=1`
                : or(
                      eq(schema.comments.approved, true),
                      req.user
                          ? eq(schema.comments.userId, req.user.id)
                          : sql`0`
                  );

            // Count total top-level comments
            const totalCountResult = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(
                    and(
                        eq(schema.comments.postSlug, postSlug),
                        isNull(schema.comments.parentId),
                        visibilityClause
                    )
                );
            const totalTopLevel = totalCountResult[0]?.count ?? 0;

            // Get paginated top-level comments
            // For complex sorting (most_liked, most_discussed), we need to fetch more and sort in memory
            const needsComplexSort =
                sort === 'most_liked' || sort === 'most_discussed';
            const fetchLimit = needsComplexSort
                ? Math.min(limit * 3, 100)
                : limit;
            const fetchOffset = needsComplexSort ? 0 : (page - 1) * limit;

            let topLevelComments = await db.query.comments.findMany({
                where: and(
                    eq(schema.comments.postSlug, postSlug),
                    isNull(schema.comments.parentId),
                    visibilityClause
                ),
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
                },
                orderBy: (comments, { desc, asc }) => {
                    // Pinned comments always come first
                    const pinnedOrder = desc(comments.pinnedAt);
                    if (sort === 'oldest') {
                        return [pinnedOrder, asc(comments.createdAt)];
                    }
                    // Default: newest first
                    return [pinnedOrder, desc(comments.createdAt)];
                },
                limit: needsComplexSort ? undefined : fetchLimit,
                offset: needsComplexSort ? undefined : fetchOffset
            });

            // For most_discussed, we need reply counts before sorting
            // Pre-fetch all replies to count them per comment
            let preReplyCountMap = new Map<string, number>();
            if (sort === 'most_discussed') {
                const allPostReplies = await db.query.comments.findMany({
                    where: and(
                        eq(schema.comments.postSlug, postSlug),
                        sql`${schema.comments.parentId} IS NOT NULL`,
                        visibilityClause
                    ),
                    columns: { parentId: true }
                });
                for (const reply of allPostReplies) {
                    if (reply.parentId) {
                        preReplyCountMap.set(
                            reply.parentId,
                            (preReplyCountMap.get(reply.parentId) || 0) + 1
                        );
                    }
                }
            }

            // Apply complex sorting if needed
            if (needsComplexSort) {
                if (sort === 'most_liked') {
                    topLevelComments = topLevelComments.sort((a, b) => {
                        // Pinned comments always first
                        if (a.pinnedAt && !b.pinnedAt) return -1;
                        if (!a.pinnedAt && b.pinnedAt) return 1;
                        const aLikes =
                            a.reactions?.filter((r) => r.type === 'like')
                                .length || 0;
                        const bLikes =
                            b.reactions?.filter((r) => r.type === 'like')
                                .length || 0;
                        return bLikes - aLikes;
                    });
                } else if (sort === 'most_discussed') {
                    topLevelComments = topLevelComments.sort((a, b) => {
                        // Pinned comments always first
                        if (a.pinnedAt && !b.pinnedAt) return -1;
                        if (!a.pinnedAt && b.pinnedAt) return 1;
                        const aReplies = preReplyCountMap.get(a.id) || 0;
                        const bReplies = preReplyCountMap.get(b.id) || 0;
                        return bReplies - aReplies;
                    });
                }
                // Apply pagination after sorting
                const startIndex = (page - 1) * limit;
                topLevelComments = topLevelComments.slice(
                    startIndex,
                    startIndex + limit
                );
            }

            // Get all replies up to maxDepth for these top-level comments
            const topLevelIds = topLevelComments.map((c) => c.id);

            // Fetch all descendant comments (we'll filter by depth later)
            const allReplies =
                topLevelIds.length > 0
                    ? await db.query.comments.findMany({
                          where: and(
                              eq(schema.comments.postSlug, postSlug),
                              sql`${schema.comments.parentId} IS NOT NULL`,
                              visibilityClause
                          ),
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
                          },
                          orderBy: (comments, { asc }) => [
                              asc(comments.createdAt)
                          ]
                      })
                    : [];

            // Get user's reactions if authenticated
            let userReactions: Map<string, { type: string }> = new Map();
            if (req.user) {
                const reactions = await db.query.commentReactions.findMany({
                    where: eq(schema.commentReactions.userId, req.user.id)
                });
                for (const r of reactions) {
                    userReactions.set(r.commentId, { type: r.type });
                }
            }

            // Count replies for each comment
            const replyCountMap = new Map<string, number>();
            for (const reply of allReplies) {
                if (reply.parentId) {
                    replyCountMap.set(
                        reply.parentId,
                        (replyCountMap.get(reply.parentId) || 0) + 1
                    );
                }
            }

            // Build tree structure with depth and reply limits
            type CommentNode = ReturnType<typeof formatComment> & {
                replies: CommentNode[];
            };

            const commentMap = new Map<string, CommentNode>();

            // First, format all top-level comments
            for (const comment of topLevelComments) {
                const totalReplies = replyCountMap.get(comment.id) || 0;
                const formatted = formatComment(
                    comment,
                    req.user?.id,
                    userReactions.get(comment.id),
                    totalReplies,
                    false // Will be updated when we add replies
                );
                commentMap.set(comment.id, { ...formatted, replies: [] });
            }

            // Then, format all replies
            for (const reply of allReplies) {
                const totalReplies = replyCountMap.get(reply.id) || 0;
                const formatted = formatComment(
                    reply,
                    req.user?.id,
                    userReactions.get(reply.id),
                    totalReplies,
                    false
                );
                commentMap.set(reply.id, { ...formatted, replies: [] });
            }

            // Build tree structure with depth and reply limits
            const rootComments: CommentNode[] = [];

            // Add top-level comments first
            for (const comment of topLevelComments) {
                const node = commentMap.get(comment.id)!;
                rootComments.push(node);
            }

            // Add replies to their parents, respecting limits
            const repliesAdded = new Map<string, number>();

            for (const reply of allReplies) {
                if (!reply.parentId) continue;

                const parentNode = commentMap.get(reply.parentId);
                if (!parentNode) continue;

                // Check depth limit
                if (reply.depth > maxDepth) continue;

                // Check replies per level limit
                const addedCount = repliesAdded.get(reply.parentId) || 0;
                if (addedCount >= repliesPerLevel) {
                    // Mark parent as having more replies
                    parentNode.hasMoreReplies = true;
                    continue;
                }

                const replyNode = commentMap.get(reply.id)!;
                parentNode.replies.push(replyNode);
                repliesAdded.set(reply.parentId, addedCount + 1);
            }

            // Update hasMoreReplies based on actual counts
            for (const [parentId, totalCount] of replyCountMap) {
                const parentNode = commentMap.get(parentId);
                if (parentNode) {
                    const addedCount = repliesAdded.get(parentId) || 0;
                    if (totalCount > addedCount) {
                        parentNode.hasMoreReplies = true;
                    }
                }
            }

            res.json({
                comments: rootComments,
                pagination: {
                    page,
                    limit,
                    totalTopLevel,
                    hasMore: page * limit < totalTopLevel
                },
                sort
            });
        } catch (error) {
            console.error('Get comments error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/comments/:id/replies - Load more replies for a specific comment
router.get(
    '/:id/replies',
    optionalAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const offset = Math.max(
                0,
                parseInt(req.query.offset as string) || 0
            );
            const limit = Math.min(
                20,
                Math.max(
                    1,
                    parseInt(req.query.limit as string) ||
                        DEFAULT_REPLIES_PER_LEVEL
                )
            );
            const maxDepth = Math.min(
                MAX_DEPTH,
                Math.max(
                    0,
                    parseInt(req.query.maxDepth as string) || DEFAULT_MAX_DEPTH
                )
            );

            // Check if parent comment exists
            const parentComment = await db.query.comments.findFirst({
                where: eq(schema.comments.id, id)
            });

            if (!parentComment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            // Check if user can view unapproved comments
            let canViewUnapproved = false;
            if (req.user) {
                const permissions = await getUserPermissions(req.user.id);
                canViewUnapproved = permissions.has('comment.view.unapproved');
            }

            const visibilityClause = canViewUnapproved
                ? sql`1=1`
                : or(
                      eq(schema.comments.approved, true),
                      req.user
                          ? eq(schema.comments.userId, req.user.id)
                          : sql`0`
                  );

            // Count total direct replies
            const totalCountResult = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(and(eq(schema.comments.parentId, id), visibilityClause));
            const totalReplies = totalCountResult[0]?.count ?? 0;

            // Get direct replies with pagination
            const replies = await db.query.comments.findMany({
                where: and(eq(schema.comments.parentId, id), visibilityClause),
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
                },
                orderBy: (comments, { asc }) => [asc(comments.createdAt)],
                limit: limit,
                offset: offset
            });

            // Get user's reactions if authenticated
            let userReactions: Map<string, { type: string }> = new Map();
            if (req.user) {
                const replyIds = replies.map((r) => r.id);
                if (replyIds.length > 0) {
                    const reactions = await db.query.commentReactions.findMany({
                        where: eq(schema.commentReactions.userId, req.user.id)
                    });
                    for (const r of reactions) {
                        userReactions.set(r.commentId, { type: r.type });
                    }
                }
            }

            // Get nested reply counts for each reply
            const replyIds = replies.map((r) => r.id);
            const nestedReplyCounts =
                replyIds.length > 0
                    ? await db
                          .select({
                              parentId: schema.comments.parentId,
                              count: count()
                          })
                          .from(schema.comments)
                          .where(
                              and(
                                  sql`${schema.comments.parentId} IN (${sql.join(
                                      replyIds.map((id) => sql`${id}`),
                                      sql`, `
                                  )})`,
                                  visibilityClause
                              )
                          )
                          .groupBy(schema.comments.parentId)
                    : [];

            const nestedCountMap = new Map<string, number>();
            for (const { parentId, count: c } of nestedReplyCounts) {
                if (parentId) nestedCountMap.set(parentId, c);
            }

            // Format replies
            const formattedReplies = replies.map((reply) => {
                const nestedCount = nestedCountMap.get(reply.id) || 0;
                return {
                    ...formatComment(
                        reply,
                        req.user?.id,
                        userReactions.get(reply.id),
                        nestedCount,
                        nestedCount > 0 && reply.depth >= maxDepth
                    ),
                    replies: [] // Will need separate call to load nested
                };
            });

            res.json({
                replies: formattedReplies,
                pagination: {
                    offset,
                    limit,
                    totalReplies,
                    hasMore: offset + limit < totalReplies
                }
            });
        } catch (error) {
            console.error('Get replies error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/comments
router.post(
    '/',
    authenticate,
    requirePermission('comment.create'),
    commentLimiter,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = createCommentSchema.parse(req.body);

            let depth = 0;
            let parentId: string | null = null;

            // Validate parent comment if provided
            if (data.parentId) {
                const parentComment = await db.query.comments.findFirst({
                    where: and(
                        eq(schema.comments.id, data.parentId),
                        isNull(schema.comments.deletedAt)
                    )
                });

                if (!parentComment) {
                    res.status(404).json({ error: 'Parent comment not found' });
                    return;
                }

                if (parentComment.postSlug !== data.postSlug) {
                    res.status(400).json({
                        error: 'Parent comment is from a different post'
                    });
                    return;
                }

                if (parentComment.depth >= MAX_DEPTH) {
                    res.status(400).json({
                        error: `Maximum reply depth (${MAX_DEPTH}) reached`
                    });
                    return;
                }

                depth = parentComment.depth + 1;
                parentId = data.parentId;
            }

            // Check if should auto-approve
            const autoApprove = await shouldAutoApprove(req.user!.id);

            const commentId = crypto.randomUUID();

            await db.insert(schema.comments).values({
                id: commentId,
                userId: req.user!.id,
                postSlug: data.postSlug,
                parentId,
                content: data.content,
                depth,
                approved: autoApprove
            });

            // Fetch the created comment with user info
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
                    },
                    reactions: true
                }
            });

            res.status(201).json({
                comment: formatComment(comment!, req.user!.id, null),
                message: autoApprove
                    ? 'Comment posted'
                    : 'Comment submitted for approval'
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            console.error('Create comment error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// PATCH /api/v1/comments/:id
router.patch(
    '/:id',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const data = updateCommentSchema.parse(req.body);

            const comment = await db.query.comments.findFirst({
                where: and(
                    eq(schema.comments.id, id),
                    isNull(schema.comments.deletedAt)
                )
            });

            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            // Check permissions
            const isOwner = comment.userId === req.user!.id;
            const permissions = await getUserPermissions(req.user!.id);
            const canEditAny = permissions.has('comment.edit.any');

            if (!isOwner && !canEditAny) {
                res.status(403).json({
                    error: 'Not authorized to edit this comment'
                });
                return;
            }

            // Save current content to history
            await db.insert(schema.commentHistory).values({
                id: crypto.randomUUID(),
                commentId: id,
                content: comment.content
            });

            // Update comment
            await db
                .update(schema.comments)
                .set({
                    content: data.content,
                    editedAt: new Date()
                })
                .where(eq(schema.comments.id, id));

            // Fetch updated comment
            const updatedComment = await db.query.comments.findFirst({
                where: eq(schema.comments.id, id),
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

            res.json({
                comment: formatComment(updatedComment!, req.user!.id, null)
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            console.error('Update comment error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// DELETE /api/v1/comments/:id (soft delete)
router.delete(
    '/:id',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const comment = await db.query.comments.findFirst({
                where: and(
                    eq(schema.comments.id, id),
                    isNull(schema.comments.deletedAt)
                )
            });

            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            // Check permissions
            const isOwner = comment.userId === req.user!.id;
            const permissions = await getUserPermissions(req.user!.id);
            const canDeleteOwn = permissions.has('comment.delete.own');
            const canDeleteAny = permissions.has('comment.delete.any');

            if (isOwner && !canDeleteOwn) {
                res.status(403).json({
                    error: 'Not authorized to delete comments'
                });
                return;
            }

            if (!isOwner && !canDeleteAny) {
                res.status(403).json({
                    error: 'Not authorized to delete this comment'
                });
                return;
            }

            // Soft delete
            await db
                .update(schema.comments)
                .set({ deletedAt: new Date() })
                .where(eq(schema.comments.id, id));

            res.json({ message: 'Comment deleted' });
        } catch (error) {
            console.error('Delete comment error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/comments/:id/history
router.get(
    '/:id/history',
    optionalAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const comment = await db.query.comments.findFirst({
                where: eq(schema.comments.id, id)
            });

            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            const history = await db.query.commentHistory.findMany({
                where: eq(schema.commentHistory.commentId, id),
                orderBy: (h, { desc }) => [desc(h.editedAt)]
            });

            // Include current content as the latest version
            const versions = [
                {
                    content: comment.deletedAt ? '[deleted]' : comment.content,
                    editedAt: comment.editedAt || comment.createdAt,
                    isCurrent: true
                },
                ...history.map((h) => ({
                    content: h.content,
                    editedAt: h.editedAt,
                    isCurrent: false
                }))
            ];

            res.json({ history: versions });
        } catch (error) {
            console.error('Get comment history error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/comments/:id/react
router.post(
    '/:id/react',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const { type } = req.body;

            if (!type || !['like', 'dislike'].includes(type)) {
                res.status(400).json({ error: 'Invalid reaction type' });
                return;
            }

            const comment = await db.query.comments.findFirst({
                where: and(
                    eq(schema.comments.id, id),
                    isNull(schema.comments.deletedAt)
                )
            });

            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            // Check for existing reaction
            const existingReaction = await db.query.commentReactions.findFirst({
                where: and(
                    eq(schema.commentReactions.commentId, id),
                    eq(schema.commentReactions.userId, req.user!.id)
                )
            });

            if (existingReaction) {
                if (existingReaction.type === type) {
                    // Remove reaction (toggle off)
                    await db
                        .delete(schema.commentReactions)
                        .where(
                            eq(schema.commentReactions.id, existingReaction.id)
                        );

                    res.json({ message: 'Reaction removed', reaction: null });
                    return;
                } else {
                    // Change reaction type
                    await db
                        .update(schema.commentReactions)
                        .set({ type })
                        .where(
                            eq(schema.commentReactions.id, existingReaction.id)
                        );

                    res.json({ message: 'Reaction updated', reaction: type });
                    return;
                }
            }

            // Create new reaction
            await db.insert(schema.commentReactions).values({
                id: crypto.randomUUID(),
                commentId: id,
                userId: req.user!.id,
                type
            });

            res.json({ message: 'Reaction added', reaction: type });
        } catch (error) {
            console.error('React to comment error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/comments/:id/pin - Pin a comment (admin only)
router.post(
    '/:id/pin',
    authenticate,
    requirePermission('comment.approve'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const comment = await db.query.comments.findFirst({
                where: and(
                    eq(schema.comments.id, id),
                    isNull(schema.comments.deletedAt)
                )
            });

            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            // Only top-level comments can be pinned
            if (comment.parentId) {
                res.status(400).json({
                    error: 'Only top-level comments can be pinned'
                });
                return;
            }

            if (comment.pinnedAt) {
                res.status(409).json({ error: 'Comment is already pinned' });
                return;
            }

            await db
                .update(schema.comments)
                .set({
                    pinnedAt: new Date(),
                    pinnedBy: req.user!.id
                })
                .where(eq(schema.comments.id, id));

            res.json({ message: 'Comment pinned' });
        } catch (error) {
            console.error('Pin comment error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/comments/:id/unpin - Unpin a comment (admin only)
router.post(
    '/:id/unpin',
    authenticate,
    requirePermission('comment.approve'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;

            const comment = await db.query.comments.findFirst({
                where: and(
                    eq(schema.comments.id, id),
                    isNull(schema.comments.deletedAt)
                )
            });

            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return;
            }

            if (!comment.pinnedAt) {
                res.status(409).json({ error: 'Comment is not pinned' });
                return;
            }

            await db
                .update(schema.comments)
                .set({
                    pinnedAt: null,
                    pinnedBy: null
                })
                .where(eq(schema.comments.id, id));

            res.json({ message: 'Comment unpinned' });
        } catch (error) {
            console.error('Unpin comment error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/comments/search - Search comments across all posts
router.get(
    '/search',
    optionalAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const query = req.query.q as string;
            const postSlug = req.query.postSlug as string;
            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.min(
                50,
                Math.max(1, parseInt(req.query.limit as string) || 20)
            );

            if (!query || query.length < 2) {
                res.status(400).json({
                    error: 'Search query must be at least 2 characters'
                });
                return;
            }

            // Check if user can view unapproved comments
            let canViewUnapproved = false;
            if (req.user) {
                const permissions = await getUserPermissions(req.user.id);
                canViewUnapproved = permissions.has('comment.view.unapproved');
            }

            const visibilityClause = canViewUnapproved
                ? sql`1=1`
                : or(
                      eq(schema.comments.approved, true),
                      req.user
                          ? eq(schema.comments.userId, req.user.id)
                          : sql`0`
                  );

            // Build where clause
            let whereClause = and(
                sql`${schema.comments.content} LIKE ${`%${query}%`}`,
                isNull(schema.comments.deletedAt),
                visibilityClause
            );

            if (postSlug) {
                whereClause = and(
                    whereClause,
                    eq(schema.comments.postSlug, postSlug)
                );
            }

            // Count total results
            const totalResult = await db
                .select({ count: count() })
                .from(schema.comments)
                .where(whereClause);
            const total = totalResult[0]?.count ?? 0;

            // Get results
            const comments = await db.query.comments.findMany({
                where: whereClause,
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
                },
                orderBy: (c, { desc }) => [desc(c.createdAt)],
                limit,
                offset: (page - 1) * limit
            });

            // Get user reactions
            let userReactions: Map<string, { type: string }> = new Map();
            if (req.user) {
                const reactions = await db.query.commentReactions.findMany({
                    where: eq(schema.commentReactions.userId, req.user.id)
                });
                for (const r of reactions) {
                    userReactions.set(r.commentId, { type: r.type });
                }
            }

            const formattedComments = comments.map((comment) =>
                formatComment(
                    comment,
                    req.user?.id,
                    userReactions.get(comment.id)
                )
            );

            res.json({
                comments: formattedComments,
                pagination: {
                    page,
                    limit,
                    total,
                    hasMore: page * limit < total
                },
                query
            });
        } catch (error) {
            console.error('Search comments error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
