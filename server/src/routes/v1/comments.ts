import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db, schema } from '../../db';
import { eq, and, isNull, or, sql } from 'drizzle-orm';
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

// Helper to check if user's comments should be auto-approved
async function shouldAutoApprove(userId: string): Promise<boolean> {
    const userGroups = await db.query.userGroups.findMany({
        where: eq(schema.userGroups.userId, userId),
        with: { group: true }
    });

    const groupNames = userGroups.map((ug) => ug.group.name);
    // Trusted users, moderators, and admins get auto-approved
    return (
        groupNames.includes('trusted') ||
        groupNames.includes('moderator') ||
        groupNames.includes('admin')
    );
}

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
    userReaction?: { type: string } | null
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
        }
    };
}

// GET /api/v1/comments?postSlug=xxx
router.get(
    '/',
    optionalAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { postSlug } = req.query;

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

            // Build where clause
            const whereClause = canViewUnapproved
                ? eq(schema.comments.postSlug, postSlug)
                : and(
                      eq(schema.comments.postSlug, postSlug),
                      or(
                          eq(schema.comments.approved, true),
                          req.user
                              ? eq(schema.comments.userId, req.user.id)
                              : sql`0`
                      )
                  );

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
                orderBy: (comments, { asc }) => [asc(comments.createdAt)]
            });

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

            // Format and nest comments
            const formattedComments = comments.map((c) =>
                formatComment(c, req.user?.id, userReactions.get(c.id))
            );

            // Build tree structure
            const commentMap = new Map<
                string,
                ReturnType<typeof formatComment> & { replies: unknown[] }
            >();
            const rootComments: Array<
                ReturnType<typeof formatComment> & { replies: unknown[] }
            > = [];

            for (const comment of formattedComments) {
                commentMap.set(comment.id, { ...comment, replies: [] });
            }

            for (const comment of formattedComments) {
                const commentWithReplies = commentMap.get(comment.id)!;
                if (comment.parentId && commentMap.has(comment.parentId)) {
                    commentMap
                        .get(comment.parentId)!
                        .replies.push(commentWithReplies);
                } else {
                    rootComments.push(commentWithReplies);
                }
            }

            res.json({ comments: rootComments });
        } catch (error) {
            console.error('Get comments error:', error);
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
                    details: error.errors
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
            const { id } = req.params;
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
                    details: error.errors
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
            const { id } = req.params;

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
            const { id } = req.params;

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
            const { id } = req.params;
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

export default router;
