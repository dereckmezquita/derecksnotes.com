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

/**
 * Comments Router
 * Handles all operations related to comment resources:
 * - Fetching comment trees for posts
 * - Creating, updating, and deleting comments
 * - Managing comment reactions (likes/dislikes)
 * - Retrieving comment revision history
 */
const router = Router();

/**
 * Extended comment interface with nested replies
 * Used for building hierarchical comment trees
 */
interface ICommentTree extends IComment {
    replies?: ICommentTree[];
}

/**
 * Sanitizes user-generated text to prevent XSS attacks
 * @param text - Raw text input from users
 * @returns Sanitized text with only allowed HTML tags and attributes
 */
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

/**
 * Recursively fetches and builds a hierarchical comment tree
 * @param parentComments - Array of parent comments
 * @param depth - Current depth of recursion
 * @param maxDepth - Maximum allowed depth for recursion
 * @returns Promise resolving to a tree structure of comments with nested replies
 */
async function fetchCommentTree(
    parentComments: IComment[],
    depth: number,
    maxDepth: number = MAX_COMMENT_DEPTH
): Promise<ICommentTree[]> {
    // Base case: return if we've reached maximum depth or invalid depth
    if (depth <= 0 || depth > maxDepth) {
        return parentComments as ICommentTree[];
    }

    // Extract parent IDs for querying child comments
    const parentIds = parentComments.map((c) => c._id);

    // Find all replies to these parent comments
    const replies = await Comment.find({ parentComment: { $in: parentIds } })
        .populate('author', 'username firstName lastName profilePhoto')
        .sort({ createdAt: 1 })
        .lean<IComment[]>();

    // Group replies by their parent comment
    const repliesByParent: Record<string, IComment[]> = {};
    for (const reply of replies) {
        if (reply.parentComment) {
            const parentId = reply.parentComment.toString();
            if (!repliesByParent[parentId]) repliesByParent[parentId] = [];
            repliesByParent[parentId].push(reply);
        }
    }

    // Build the hierarchical tree by recursively fetching nested replies
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

/**
 * POST /comments
 * Creates a new comment on a post
 * Requires authentication
 */
router.post(
    '/comments',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            let { text, postSlug, parentCommentId } = req.body;
            const userId = req.user?._id;

            // Normalize the slug
            postSlug = postSlug.replace(/^\/+|\/+$/g, '');

            // Validate comment text
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

            // Find the associated post
            const post = await Post.findOne({ slug: postSlug }).lean();
            if (!post) {
                return res.status(404).json({
                    error: 'Post not found',
                    code: 'POST_NOT_FOUND'
                });
            }

            // Verify parent comment if provided and check nesting depth
            if (parentCommentId) {
                const parentComment =
                    await Comment.findById(parentCommentId).lean<IComment>();
                if (!parentComment) {
                    return res.status(400).json({
                        error: 'Parent comment not found',
                        code: 'PARENT_NOT_FOUND'
                    });
                }

                // Calculate the comment depth to enforce maximum nesting limit
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

            // Sanitize text to prevent XSS
            const sanitizedText = sanitizeText(text);

            // Create the new comment
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

            // Populate author details for the response
            const populatedComment = await Comment.findById(newComment._id)
                .populate('author', 'username firstName lastName profilePhoto')
                .lean();

            // Fix: Force serialization of MongoDB-specific types (ObjectId, Date)
            // by converting to JSON string and back to a plain JavaScript object
            const serializedComment = JSON.parse(
                JSON.stringify(populatedComment)
            );

            // Ensure replies field is present and is an empty array
            serializedComment.replies = [];

            return res.status(201).json(serializedComment);
        } catch (error: any) {
            console.error('Error creating comment:', error);
            return res.status(500).json({
                error: 'Internal server error',
                code: 'SERVER_ERROR'
            });
        }
    }
);

/**
 * GET /comments/post/*
 * Retrieves comments for a post, supporting hierarchical paths in the slug
 * Public endpoint (no authentication required)
 */
router.get('/comments/post/*', async (req: Request, res: Response) => {
    try {
        // Extract the complete path from the wildcard match
        let postSlug = req.params[0];

        // Ensure consistent slug format (no leading or trailing slashes)
        postSlug = postSlug.replace(/^\/+|\/+$/g, '');

        // Log operation for debugging
        console.log(`Looking for post with slug: "${postSlug}"`);

        // Parse query parameters with defaults
        const depth = Math.min(
            parseInt(req.query.depth as string, 10) || 2,
            MAX_COMMENT_DEPTH
        );
        const limit = parseInt(req.query.limit as string, 10) || 20;
        const skip = parseInt(req.query.skip as string, 10) || 0;

        // Find the post by its slug
        const post = await Post.findOne({ slug: postSlug }).lean();
        if (!post) {
            console.log(`Post not found with slug: "${postSlug}"`);
            return res.status(404).json({
                error: 'Post not found',
                code: 'POST_NOT_FOUND'
            });
        }

        console.log(`Found post: ${post._id} for slug: "${postSlug}"`);

        // Fetch top-level comments for the post with pagination
        const topLevelComments = await Comment.find({
            post: post._id,
            parentComment: null
        })
            .populate('author', 'username firstName lastName profilePhoto')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean<IComment[]>();

        // Build the comment tree recursively
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

/**
 * GET /comments/:id/replies
 * Retrieves replies for a specific comment
 * Public endpoint (no authentication required)
 */
router.get('/comments/:id/replies', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const depth = Math.min(
            parseInt(req.query.depth as string, 10) || 2,
            MAX_COMMENT_DEPTH
        );

        // Find the parent comment
        const comment = await Comment.findById(id)
            .populate('author', 'username firstName lastName profilePhoto')
            .lean<IComment>();

        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found',
                code: 'COMMENT_NOT_FOUND'
            });
        }

        // Find direct replies to this comment
        const replies = await Comment.find({ parentComment: comment._id })
            .populate('author', 'username firstName lastName profilePhoto')
            .sort({ createdAt: 1 })
            .lean<IComment[]>();

        // Build nested reply tree if depth > 1
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

/**
 * GET /comments/:id/history
 * Retrieves revision history for a specific comment
 * Public endpoint (no authentication required)
 */
router.get('/comments/:id/history', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Find the comment with author details
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

/**
 * PUT /comments/:id
 * Updates a specific comment (requires authentication as comment author)
 */
router.put(
    '/comments/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { text } = req.body;
            const userId = req.user?._id;

            // Validate updated text
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

            // Find the comment to update
            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(404).json({
                    error: 'Comment not found',
                    code: 'COMMENT_NOT_FOUND'
                });
            }

            // Verify ownership
            if (comment.author.toString() !== userId?.toString()) {
                return res.status(403).json({
                    error: 'Not authorized to update this comment',
                    code: 'NOT_AUTHORIZED'
                });
            }

            // Prevent editing deleted comments
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

/**
 * DELETE /comments/:id
 * Soft deletes a comment (requires authentication as comment author)
 */
router.delete(
    '/comments/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            // Find the comment to delete
            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(404).json({
                    error: 'Comment not found',
                    code: 'COMMENT_NOT_FOUND'
                });
            }

            // Verify ownership
            if (comment.author.toString() !== userId?.toString()) {
                return res.status(403).json({
                    error: 'Not authorized to delete this comment',
                    code: 'NOT_AUTHORIZED'
                });
            }

            // Prevent deleting already deleted comments
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

/**
 * POST /comments/:id/like
 * Adds a like to a comment (requires authentication)
 */
router.post(
    '/comments/:id/like',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            // Find the comment
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

/**
 * POST /comments/:id/dislike
 * Adds a dislike to a comment (requires authentication)
 */
router.post(
    '/comments/:id/dislike',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            // Find the comment
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

/**
 * POST /comments/:id/clear-reaction
 * Removes any reaction (like/dislike) from a comment (requires authentication)
 */
router.post(
    '/comments/:id/clear-reaction',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            // Find the comment
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
