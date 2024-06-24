import { Router, type Request, type Response } from 'express';
import { Comment, type IComment } from '../../db/models/Comment';
import { User } from '../../db/models/User';
import { authMiddleware, isVerifiedMiddleware } from '../../middleware/isAuth';
import mongoose from 'mongoose';

const router = Router();

const MAX_COMMENT_DEPTH = 3;

// Create a new comment
router.post(
    '/comments',
    authMiddleware,
    isVerifiedMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { content, postSlug, parentCommentId } = req.body;
            const userId = req.session.userId;

            let depth = 0;
            if (parentCommentId) {
                const parentComment = await Comment.findById(parentCommentId);
                if (!parentComment) {
                    return res
                        .status(404)
                        .json({ error: 'Parent comment not found' });
                }
                depth = parentComment.depth + 1;
                if (depth > MAX_COMMENT_DEPTH) {
                    return res
                        .status(400)
                        .json({ error: 'Maximum comment depth reached' });
                }
            }

            const newComment = new Comment({
                content,
                author: userId,
                post: postSlug,
                parentComment: parentCommentId,
                depth
            });

            await newComment.save();

            if (parentCommentId) {
                await Comment.findByIdAndUpdate(parentCommentId, {
                    $push: { replies: newComment._id }
                });
            }

            res.status(201).json(newComment);
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({
                error: 'An error occurred while creating the comment'
            });
        }
    }
);

// Get comments for a post
router.get('/comments/:postSlug', async (req: Request, res: Response) => {
    try {
        const { postSlug } = req.params;
        const comments = await Comment.findByPostSlug(postSlug);
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            error: 'An error occurred while fetching comments'
        });
    }
});

// Get replies for a comment
router.get(
    '/comments/:commentId/replies',
    async (req: Request, res: Response) => {
        try {
            const { commentId } = req.params;
            const replies = await Comment.find({ parentComment: commentId })
                .sort('-createdAt')
                .populate('author', 'username profilePhoto')
                .exec();
            res.json(replies);
        } catch (error) {
            console.error('Error fetching replies:', error);
            res.status(500).json({
                error: 'An error occurred while fetching replies'
            });
        }
    }
);

// Update a comment
router.put(
    '/comments/:commentId',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { commentId } = req.params;
            const { content } = req.body;
            const userId = req.session.userId;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            if (comment.author.toString() !== userId) {
                return res.status(403).json({
                    error: 'You are not authorized to update this comment'
                });
            }

            comment.content = content;
            await comment.save();

            res.json(comment);
        } catch (error) {
            console.error('Error updating comment:', error);
            res.status(500).json({
                error: 'An error occurred while updating the comment'
            });
        }
    }
);

// Delete a comment
router.delete(
    '/comments/:commentId',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { commentId } = req.params;
            const userId = req.session.userId;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (comment.author.toString() !== userId && user.role !== 'admin') {
                return res.status(403).json({
                    error: 'You are not authorized to delete this comment'
                });
            }

            await Comment.findByIdAndDelete(commentId);

            if (comment.parentComment) {
                await Comment.findByIdAndUpdate(comment.parentComment, {
                    $pull: { replies: commentId }
                });
            }

            res.json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({
                error: 'An error occurred while deleting the comment'
            });
        }
    }
);

// Like a comment
router.post(
    '/comments/:commentId/like',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { commentId } = req.params;
            const userId = req.session.userId;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            const userObjectId = new mongoose.Types.ObjectId(userId);

            if (comment.likes.includes(userObjectId)) {
                await Comment.findByIdAndUpdate(commentId, {
                    $pull: { likes: userObjectId }
                });
            } else {
                await Comment.findByIdAndUpdate(commentId, {
                    $push: { likes: userObjectId },
                    $pull: { dislikes: userObjectId }
                });
            }

            const updatedComment = await Comment.findById(commentId);
            res.json(updatedComment);
        } catch (error) {
            console.error('Error liking comment:', error);
            res.status(500).json({
                error: 'An error occurred while liking the comment'
            });
        }
    }
);

// Dislike a comment
router.post(
    '/comments/:commentId/dislike',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { commentId } = req.params;
            const userId = req.session.userId;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            const userObjectId = new mongoose.Types.ObjectId(userId);

            if (comment.dislikes.includes(userObjectId)) {
                await Comment.findByIdAndUpdate(commentId, {
                    $pull: { dislikes: userObjectId }
                });
            } else {
                await Comment.findByIdAndUpdate(commentId, {
                    $push: { dislikes: userObjectId },
                    $pull: { likes: userObjectId }
                });
            }

            const updatedComment = await Comment.findById(commentId);
            res.json(updatedComment);
        } catch (error) {
            console.error('Error disliking comment:', error);
            res.status(500).json({
                error: 'An error occurred while disliking the comment'
            });
        }
    }
);

export default router;
