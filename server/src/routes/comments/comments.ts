// server/src/routes/comments/comments.ts
import { Router } from 'express';
import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Comment } from '../../db/models/Comment';
import type { IComment, ICommentRevision } from '../../db/models/Comment';
import { Post } from '../../db/models/Post';
import { User } from '../../db/models/User';
import { authMiddleware } from '../../middleware/isAuth';
import { MAX_COMMENT_DEPTH, MAX_COMMENT_LENGTH } from '../../utils/constants';
import sanitizeHtml from 'sanitize-html';

const router = Router();

interface ICommentTree extends IComment {
    replies?: ICommentTree[];
}

// Sanitize user-generated text
function sanitizeText(text: string): string {
    return sanitizeHtml(text, {
        allowedTags: [
            'b',
            'i',
            'em',
            'strong',
            'a',
            'p',
            'br',
            'ul',
            'ol',
            'li',
            'code',
            'pre'
        ],
        allowedAttributes: {
            a: ['href', 'target', 'rel']
        },
        selfClosing: ['br'],
        allowedSchemes: ['http', 'https', 'mailto']
    });
}

// Recursive helper
async function fetchCommentTree(
    parentComments: IComment[],
    depth: number,
    maxDepth: number = MAX_COMMENT_DEPTH
): Promise<ICommentTree[]> {
    if (depth <= 0 || depth > maxDepth) {
        return parentComments as ICommentTree[];
    }

    const parentIds = parentComments.map((c) => c._id);
    const replies = await Comment.find({ parentComment: { $in: parentIds } })
        .populate('author', 'username firstName lastName profilePhoto')
        .sort({ createdAt: 1 })
        .lean<IComment[]>();

    const repliesByParent: Record<string, IComment[]> = {};
    for (const reply of replies) {
        if (reply.parentComment) {
            const parentId = reply.parentComment.toString();
            if (!repliesByParent[parentId]) repliesByParent[parentId] = [];
            repliesByParent[parentId].push(reply);
        }
    }

    const results: ICommentTree[] = [];
    for (const parent of parentComments) {
        const parentIdStr = parent._id.toString();
        const children = repliesByParent[parentIdStr] || [];
        const nestedReplies = await fetchCommentTree(
            children,
            depth - 1,
            maxDepth
        );
        results.push({ ...parent, replies: nestedReplies });
    }

    return results;
}

// Create a new comment
router.post(
    '/comments',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { text, postSlug, parentCommentId } = req.body;
            const userId = req.user?._id;

            if (!text || text.trim().length === 0) {
                return res.status(400).json({
                    error: 'Comment text cannot be empty',
                    code: 'EMPTY_COMMENT'
                });
            }

            if (text.length > MAX_COMMENT_LENGTH) {
                return res.status(400).json({
                    error: `Comment text exceeds maximum length of ${MAX_COMMENT_LENGTH} characters`,
                    code: 'COMMENT_TOO_LONG'
                });
            }

            const post = await Post.findOne({ slug: postSlug }).lean();
            if (!post) {
                return res.status(404).json({
                    error: 'Post not found',
                    code: 'POST_NOT_FOUND'
                });
            }

            // Verify parent comment if provided
            if (parentCommentId) {
                const parentComment =
                    await Comment.findById(parentCommentId).lean<IComment>();
                if (!parentComment) {
                    return res.status(400).json({
                        error: 'Parent comment not found',
                        code: 'PARENT_NOT_FOUND'
                    });
                }

                // Get the comment depth
                let depth = 1;
                let currentParentId = parentComment.parentComment;

                while (currentParentId && depth < MAX_COMMENT_DEPTH) {
                    depth++;
                    const parent =
                        await Comment.findById(
                            currentParentId
                        ).lean<IComment>();
                    if (!parent) break;
                    currentParentId = parent.parentComment;
                }

                if (depth >= MAX_COMMENT_DEPTH) {
                    return res.status(400).json({
                        error: `Maximum comment nesting depth of ${MAX_COMMENT_DEPTH} reached`,
                        code: 'MAX_DEPTH_REACHED'
                    });
                }
            }

            // Sanitize text
            const sanitizedText = sanitizeText(text);

            const newComment = await Comment.create({
                text: sanitizedText,
                originalContent: sanitizedText,
                author: userId,
                post: post._id,
                parentComment: parentCommentId
                    ? new Types.ObjectId(parentCommentId)
                    : null,
                revisions: []
            });

            // Populate author details
            const populatedComment = await Comment.findById(newComment._id)
                .populate('author', 'username firstName lastName profilePhoto')
                .lean<IComment>();

            return res.status(201).json({
                ...populatedComment,
                replies: []
            });
        } catch (error: any) {
            console.error('Error creating comment:', error);
            return res.status(500).json({
                error: 'Internal server error',
                code: 'SERVER_ERROR'
            });
        }
    }
);

// Get comments for a post by slug
router.get('/comments/post/:postSlug', async (req: Request, res: Response) => {
    try {
        const { postSlug } = req.params;
        // Default depth of 2, max is MAX_COMMENT_DEPTH
        const depth = Math.min(
            parseInt(req.query.depth as string, 10) || 2,
            MAX_COMMENT_DEPTH
        );
        const limit = parseInt(req.query.limit as string, 10) || 20; // Default limit
        const skip = parseInt(req.query.skip as string, 10) || 0; // Default skip

        const post = await Post.findOne({ slug: postSlug }).lean();
        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                code: 'POST_NOT_FOUND'
            });
        }

        // Apply limit & skip for top-level comments
        const topLevelComments = await Comment.find({
            post: post._id,
            parentComment: null
        })
            .populate('author', 'username firstName lastName profilePhoto')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean<IComment[]>();

        const commentTree = await fetchCommentTree(topLevelComments, depth);

        // Get total count for pagination
        const totalComments = await Comment.countDocuments({
            post: post._id,
            parentComment: null
        });

        return res.json({
            comments: commentTree,
            pagination: {
                total: totalComments,
                page: Math.floor(skip / limit) + 1,
                pageSize: limit,
                pages: Math.ceil(totalComments / limit)
            }
        });
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({
            error: 'Internal server error',
            code: 'SERVER_ERROR'
        });
    }
});

// Get more replies for a single comment
router.get('/comments/:id/replies', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const depth = Math.min(
            parseInt(req.query.depth as string, 10) || 2,
            MAX_COMMENT_DEPTH
        );

        const comment = await Comment.findById(id)
            .populate('author', 'username firstName lastName profilePhoto')
            .lean<IComment>();

        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found',
                code: 'COMMENT_NOT_FOUND'
            });
        }

        // Find direct replies
        const replies = await Comment.find({ parentComment: comment._id })
            .populate('author', 'username firstName lastName profilePhoto')
            .sort({ createdAt: 1 })
            .lean<IComment[]>();

        // Get nested replies if depth > 1
        const repliesTree = await fetchCommentTree(replies, depth - 1);

        return res.json(repliesTree);
    } catch (error: any) {
        console.error('Error fetching replies:', error);
        return res.status(500).json({
            error: 'Internal server error',
            code: 'SERVER_ERROR'
        });
    }
});

// Get revision history for a comment
router.get('/comments/:id/history', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id)
            .populate('author', 'username firstName lastName profilePhoto')
            .lean<IComment>();

        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found',
                code: 'COMMENT_NOT_FOUND'
            });
        }

        // Build full history including current version
        const currentVersion = {
            text: comment.text,
            timestamp: comment.lastEditedAt || comment.createdAt
        };

        // Return history in reverse chronological order (newest first)
        const history = [currentVersion, ...(comment.revisions || [])].sort(
            (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
        );

        return res.json({
            commentId: comment._id,
            author: comment.author,
            createdAt: comment.createdAt,
            history
        });
    } catch (error: any) {
        console.error('Error fetching comment history:', error);
        return res.status(500).json({
            error: 'Internal server error',
            code: 'SERVER_ERROR'
        });
    }
});

// Update a comment (user must be the author)
router.put(
    '/comments/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { text } = req.body;
            const userId = req.user?._id;

            if (!text || text.trim().length === 0) {
                return res.status(400).json({
                    error: 'Comment text cannot be empty',
                    code: 'EMPTY_COMMENT'
                });
            }

            if (text.length > MAX_COMMENT_LENGTH) {
                return res.status(400).json({
                    error: `Comment text exceeds maximum length of ${MAX_COMMENT_LENGTH} characters`,
                    code: 'COMMENT_TOO_LONG'
                });
            }

            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(404).json({
                    error: 'Comment not found',
                    code: 'COMMENT_NOT_FOUND'
                });
            }

            if (comment.author.toString() !== userId?.toString()) {
                return res.status(403).json({
                    error: 'Not authorized to update this comment',
                    code: 'NOT_AUTHORIZED'
                });
            }

            if (comment.deleted) {
                return res.status(400).json({
                    error: 'Cannot edit a deleted comment',
                    code: 'COMMENT_DELETED'
                });
            }

            // Only save a revision if the text actually changed
            if (comment.text !== text) {
                // Sanitize text
                const sanitizedText = sanitizeText(text);

                // Add current text to revisions
                const revision: ICommentRevision = {
                    text: comment.text,
                    timestamp: new Date()
                };

                // Update the comment
                comment.revisions.push(revision);
                comment.text = sanitizedText;
                comment.lastEditedAt = new Date();
                await comment.save();
            }

            // Return the updated comment with populated author
            const updatedComment = await Comment.findById(id)
                .populate('author', 'username firstName lastName profilePhoto')
                .lean<IComment>();

            return res.json(updatedComment);
        } catch (error: any) {
            console.error('Error updating comment:', error);
            return res.status(500).json({
                error: 'Internal server error',
                code: 'SERVER_ERROR'
            });
        }
    }
);

// Soft delete a comment (user must be the author)
router.delete(
    '/comments/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(404).json({
                    error: 'Comment not found',
                    code: 'COMMENT_NOT_FOUND'
                });
            }

            if (comment.author.toString() !== userId?.toString()) {
                return res.status(403).json({
                    error: 'Not authorized to delete this comment',
                    code: 'NOT_AUTHORIZED'
                });
            }

            if (comment.deleted) {
                return res.status(400).json({
                    error: 'Comment already deleted',
                    code: 'ALREADY_DELETED'
                });
            }

            // Soft delete: mark as deleted but keep the record
            comment.deleted = true;
            comment.text = '[deleted]';
            await comment.save();

            return res.json({
                message: 'Comment deleted successfully',
                commentId: comment._id
            });
        } catch (error: any) {
            console.error('Error deleting comment:', error);
            return res.status(500).json({
                error: 'Internal server error',
                code: 'SERVER_ERROR'
            });
        }
    }
);

// Like a comment
router.post(
    '/comments/:id/like',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(404).json({
                    error: 'Comment not found',
                    code: 'COMMENT_NOT_FOUND'
                });
            }

            // Remove from dislikes if present
            comment.dislikes = comment.dislikes.filter(
                (u) => u.toString() !== userId?.toString()
            );

            // Add to likes if not already there
            if (
                !comment.likes.some((u) => u.toString() === userId?.toString())
            ) {
                comment.likes.push(userId as any);
            }

            await comment.save();

            return res.json({
                commentId: comment._id,
                likes: comment.likes.length,
                dislikes: comment.dislikes.length,
                userLiked: true,
                userDisliked: false
            });
        } catch (error: any) {
            console.error('Error liking comment:', error);
            return res.status(500).json({
                error: 'Internal server error',
                code: 'SERVER_ERROR'
            });
        }
    }
);

// Dislike a comment
router.post(
    '/comments/:id/dislike',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(404).json({
                    error: 'Comment not found',
                    code: 'COMMENT_NOT_FOUND'
                });
            }

            // Remove from likes if present
            comment.likes = comment.likes.filter(
                (u) => u.toString() !== userId?.toString()
            );

            // Add to dislikes if not already there
            if (
                !comment.dislikes.some(
                    (u) => u.toString() === userId?.toString()
                )
            ) {
                comment.dislikes.push(userId as any);
            }

            await comment.save();

            return res.json({
                commentId: comment._id,
                likes: comment.likes.length,
                dislikes: comment.dislikes.length,
                userLiked: false,
                userDisliked: true
            });
        } catch (error: any) {
            console.error('Error disliking comment:', error);
            return res.status(500).json({
                error: 'Internal server error',
                code: 'SERVER_ERROR'
            });
        }
    }
);

// Remove reaction from a comment
router.post(
    '/comments/:id/clear-reaction',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(404).json({
                    error: 'Comment not found',
                    code: 'COMMENT_NOT_FOUND'
                });
            }

            // Remove from both likes and dislikes
            comment.likes = comment.likes.filter(
                (u) => u.toString() !== userId?.toString()
            );
            comment.dislikes = comment.dislikes.filter(
                (u) => u.toString() !== userId?.toString()
            );

            await comment.save();

            return res.json({
                commentId: comment._id,
                likes: comment.likes.length,
                dislikes: comment.dislikes.length,
                userLiked: false,
                userDisliked: false
            });
        } catch (error: any) {
            console.error('Error clearing reaction:', error);
            return res.status(500).json({
                error: 'Internal server error',
                code: 'SERVER_ERROR'
            });
        }
    }
);

export default router;
