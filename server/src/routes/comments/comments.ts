import express, { type Request, type Response } from 'express';
import { Comment } from '../../db/models/Comment';
import { isAuthAndVerifiedMiddleware } from '../../middleware/isAuth';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * Allows fetching top-level comments and replies
 */
router.get('/comments', async (req: Request, res: Response) => {
    const { post, depth = 1, limit = 10, page = 1 } = req.query;

    if (!post || typeof post !== 'string') {
        return res.status(400).json({ message: 'Post parameter is required' });
    }

    const decodedPost = decodeURIComponent(post);

    try {
        const { comments, total } = await Comment.findByPostSlug(decodedPost, {
            depth: Number(depth),
            limit: Number(limit),
            page: Number(page)
        });

        res.json({
            comments,
            total,
            page: Number(page),
            limit: Number(limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
});

// Create a new comment
router.post(
    '/comments',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const { content, post, parentComment } = req.body;
        const userId: string | undefined = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedPost = decodeURIComponent(post);

        try {
            // Convert userId string to ObjectId
            const authorId = new mongoose.Types.ObjectId(userId);

            let depth = 0;
            if (parentComment) {
                const parent = await Comment.findById(parentComment);
                depth = parent ? parent.depth + 1 : 0;
            }

            const newComment = new Comment({
                content,
                author: authorId, // Use the ObjectId here
                post: decodedPost,
                parentComment,
                depth
            });

            await newComment.save();

            if (parentComment) {
                await Comment.findByIdAndUpdate(parentComment, {
                    $push: { replies: newComment._id }
                });
            }

            // Populate the author information for the response
            await newComment.populate(
                'author',
                'username profilePhoto createdAt role'
            );

            res.status(201).json(newComment);
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(400).json({ message: 'Error creating comment', error });
        }
    }
);

// Update a comment
router.put(
    '/comments/:commentId',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const { content } = req.body;

        try {
            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { content, updatedAt: new Date() },
                { new: true }
            );

            if (!updatedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            res.json(updatedComment);
        } catch (error) {
            res.status(400).json({ message: 'Error updating comment', error });
        }
    }
);

// Soft delete a comment
router.delete(
    '/comments/:commentId',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const { commentId } = req.params;

        try {
            const deletedComment = await Comment.findByIdAndUpdate(
                commentId,
                {
                    content: '[deleted comment]',
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!deletedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            res.json({ message: 'Comment soft deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: 'Error deleting comment', error });
        }
    }
);

// Like a comment
router.post(
    '/comments/:commentId/like',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const { userId } = req.body;

        try {
            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            if (comment.likes.includes(userId)) {
                return res
                    .status(400)
                    .json({ message: 'Comment already liked by this user' });
            }

            comment.likes.push(userId);
            await comment.save();

            res.json({ message: 'Comment liked successfully' });
        } catch (error) {
            res.status(400).json({ message: 'Error liking comment', error });
        }
    }
);

// Unlike a comment
router.post(
    '/comments/:commentId/unlike',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const { userId } = req.body;

        try {
            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            comment.likes = comment.likes.filter(
                (id) => id.toString() !== userId
            );
            await comment.save();

            res.json({ message: 'Comment unliked successfully' });
        } catch (error) {
            res.status(400).json({ message: 'Error unliking comment', error });
        }
    }
);

export default router;
