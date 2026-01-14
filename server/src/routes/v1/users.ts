import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { db, schema } from '@db/index';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import { authenticate, requirePermission } from '@middleware/auth';
import {
    hashPassword,
    verifyPassword,
    revokeAllSessions
} from '@services/auth';
import type { AuthenticatedRequest } from '@/types';
import { dbLogger } from '@services/logger';

// Helper to format comment for profile view
function formatProfileComment(
    comment: typeof schema.comments.$inferSelect & {
        reactions?: Array<{ type: string; userId: string }>;
        user?: {
            id: string;
            username: string;
            displayName: string | null;
            avatarUrl: string | null;
        } | null;
        parent?:
            | (typeof schema.comments.$inferSelect & {
                  user?: {
                      id: string;
                      username: string;
                      displayName: string | null;
                      avatarUrl: string | null;
                  } | null;
              })
            | null;
    },
    currentUserId: string
) {
    const reactions = comment.reactions || [];
    const likes = reactions.filter((r) => r.type === 'like').length;
    const dislikes = reactions.filter((r) => r.type === 'dislike').length;
    const userReaction = reactions.find((r) => r.userId === currentUserId);

    // Format parent comment if it exists
    const parentComment = comment.parent
        ? {
              id: comment.parent.id,
              content: comment.parent.deletedAt
                  ? '[deleted]'
                  : comment.parent.content,
              isDeleted: !!comment.parent.deletedAt,
              user: comment.parent.user
                  ? {
                        id: comment.parent.user.id,
                        username: comment.parent.user.username,
                        displayName: comment.parent.user.displayName,
                        avatarUrl: comment.parent.user.avatarUrl
                    }
                  : null
          }
        : null;

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
        isOwner: comment.userId === currentUserId,
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
        parentComment
    };
}

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
    displayName: z
        .string()
        .min(1, 'Display name cannot be empty')
        .max(50, 'Display name must be at most 50 characters')
        .optional(),
    bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
    avatarUrl: z.string().url('Invalid URL').optional().nullable()
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

// GET /api/v1/users/:username
router.get('/:username', async (req: Request, res: Response): Promise<void> => {
    try {
        const username = req.params.username as string;

        const user = await db.query.users.findFirst({
            where: and(
                eq(schema.users.username, username),
                isNull(schema.users.deletedAt)
            ),
            columns: {
                id: true,
                username: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
                createdAt: true
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        dbLogger.error('Get user failed', error as Error, { source: 'users' });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/v1/users/me
router.patch(
    '/me',
    authenticate,
    requirePermission('user.edit.own'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = updateProfileSchema.parse(req.body);

            const updateData: Record<string, unknown> = {
                updatedAt: new Date()
            };

            if (data.displayName !== undefined) {
                updateData.displayName = data.displayName;
            }
            if (data.bio !== undefined) {
                updateData.bio = data.bio;
            }
            if (data.avatarUrl !== undefined) {
                updateData.avatarUrl = data.avatarUrl;
            }

            await db
                .update(schema.users)
                .set(updateData)
                .where(eq(schema.users.id, req.user!.id));

            const updatedUser = await db.query.users.findFirst({
                where: eq(schema.users.id, req.user!.id),
                columns: {
                    id: true,
                    username: true,
                    displayName: true,
                    bio: true,
                    avatarUrl: true
                }
            });

            res.json(updatedUser);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Update profile failed', error as Error, {
                source: 'users'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/users/me/password
router.post(
    '/me/password',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const data = changePasswordSchema.parse(req.body);

            // Get current user
            const user = await db.query.users.findFirst({
                where: eq(schema.users.id, req.user!.id)
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Verify current password
            const valid = await verifyPassword(
                data.currentPassword,
                user.passwordHash
            );
            if (!valid) {
                res.status(401).json({
                    error: 'Current password is incorrect'
                });
                return;
            }

            // Update password
            const newHash = await hashPassword(data.newPassword);
            await db
                .update(schema.users)
                .set({
                    passwordHash: newHash,
                    updatedAt: new Date()
                })
                .where(eq(schema.users.id, req.user!.id));

            // Revoke all other sessions for security
            await revokeAllSessions(req.user!.id);

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
                return;
            }
            dbLogger.error('Change password failed', error as Error, {
                source: 'users'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// DELETE /api/v1/users/me (soft delete)
router.delete(
    '/me',
    authenticate,
    requirePermission('user.delete.own'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            // Soft delete user
            await db
                .update(schema.users)
                .set({
                    deletedAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(schema.users.id, req.user!.id));

            // Revoke all sessions
            await revokeAllSessions(req.user!.id);

            res.clearCookie('sessionId');

            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            dbLogger.error('Delete account failed', error as Error, {
                source: 'users'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/users/me/comments - User's own comments
router.get(
    '/me/comments',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const comments = await db.query.comments.findMany({
                where: eq(schema.comments.userId, req.user!.id),
                with: {
                    reactions: true,
                    user: {
                        columns: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true
                        }
                    },
                    parent: {
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
                    }
                },
                orderBy: (c, { desc }) => [desc(c.createdAt)]
            });

            res.json({
                comments: comments.map((c) =>
                    formatProfileComment(c, req.user!.id)
                )
            });
        } catch (error) {
            dbLogger.error('Get user comments failed', error as Error, {
                source: 'users'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/users/me/comments/liked - Comments user has liked
router.get(
    '/me/comments/liked',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const likedReactions = await db.query.commentReactions.findMany({
                where: and(
                    eq(schema.commentReactions.userId, req.user!.id),
                    eq(schema.commentReactions.type, 'like')
                )
            });

            const commentIds = likedReactions.map((r) => r.commentId);

            if (commentIds.length === 0) {
                res.json({ comments: [] });
                return;
            }

            const comments = await db.query.comments.findMany({
                where: inArray(schema.comments.id, commentIds),
                with: {
                    reactions: true,
                    user: {
                        columns: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true
                        }
                    },
                    parent: {
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
                    }
                },
                orderBy: (c, { desc }) => [desc(c.createdAt)]
            });

            res.json({
                comments: comments.map((c) =>
                    formatProfileComment(c, req.user!.id)
                )
            });
        } catch (error) {
            dbLogger.error('Get liked comments failed', error as Error, {
                source: 'users'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// GET /api/v1/users/me/comments/disliked - Comments user has disliked
router.get(
    '/me/comments/disliked',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const dislikedReactions = await db.query.commentReactions.findMany({
                where: and(
                    eq(schema.commentReactions.userId, req.user!.id),
                    eq(schema.commentReactions.type, 'dislike')
                )
            });

            const commentIds = dislikedReactions.map((r) => r.commentId);

            if (commentIds.length === 0) {
                res.json({ comments: [] });
                return;
            }

            const comments = await db.query.comments.findMany({
                where: inArray(schema.comments.id, commentIds),
                with: {
                    reactions: true,
                    user: {
                        columns: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true
                        }
                    },
                    parent: {
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
                    }
                },
                orderBy: (c, { desc }) => [desc(c.createdAt)]
            });

            res.json({
                comments: comments.map((c) =>
                    formatProfileComment(c, req.user!.id)
                )
            });
        } catch (error) {
            dbLogger.error('Get disliked comments failed', error as Error, {
                source: 'users'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/users/me/comments/bulk-delete
router.post(
    '/me/comments/bulk-delete',
    authenticate,
    requirePermission('comment.delete.own'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { commentIds } = req.body;

            if (!Array.isArray(commentIds) || commentIds.length === 0) {
                res.status(400).json({
                    error: 'commentIds must be a non-empty array'
                });
                return;
            }

            // Only delete comments that belong to the user
            const result = await db
                .update(schema.comments)
                .set({ deletedAt: new Date() })
                .where(
                    and(
                        inArray(schema.comments.id, commentIds),
                        eq(schema.comments.userId, req.user!.id),
                        isNull(schema.comments.deletedAt)
                    )
                );

            res.json({
                message: 'Comments deleted',
                deletedCount: commentIds.length
            });
        } catch (error) {
            dbLogger.error('Bulk delete comments failed', error as Error, {
                source: 'users'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/users/me/comments/bulk-unlike
router.post(
    '/me/comments/bulk-unlike',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { commentIds } = req.body;

            if (!Array.isArray(commentIds) || commentIds.length === 0) {
                res.status(400).json({
                    error: 'commentIds must be a non-empty array'
                });
                return;
            }

            await db
                .delete(schema.commentReactions)
                .where(
                    and(
                        inArray(schema.commentReactions.commentId, commentIds),
                        eq(schema.commentReactions.userId, req.user!.id),
                        eq(schema.commentReactions.type, 'like')
                    )
                );

            res.json({
                message: 'Likes removed',
                modifiedCount: commentIds.length
            });
        } catch (error) {
            dbLogger.error('Bulk unlike failed', error as Error, {
                source: 'users'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// POST /api/v1/users/me/comments/bulk-undislike
router.post(
    '/me/comments/bulk-undislike',
    authenticate,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { commentIds } = req.body;

            if (!Array.isArray(commentIds) || commentIds.length === 0) {
                res.status(400).json({
                    error: 'commentIds must be a non-empty array'
                });
                return;
            }

            await db
                .delete(schema.commentReactions)
                .where(
                    and(
                        inArray(schema.commentReactions.commentId, commentIds),
                        eq(schema.commentReactions.userId, req.user!.id),
                        eq(schema.commentReactions.type, 'dislike')
                    )
                );

            res.json({
                message: 'Dislikes removed',
                modifiedCount: commentIds.length
            });
        } catch (error) {
            dbLogger.error('Bulk undislike failed', error as Error, {
                source: 'users'
            });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
