import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import Comment from '@models/Comment';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';
import isVerified from '@utils/middleware/isVerified';

const edit_comment = Router();

interface EditCommentRequest {
    commentId: string;
    content: string;
}

edit_comment.patch(
    '/edit_comment',
    isAuthenticated,
    isVerified,
    async (req: Request, res: Response) => {
        try {
            const { commentId, content } = req.body as EditCommentRequest;

            // Validate input
            if (!commentId || !content) {
                return res
                    .status(400)
                    .json({ message: 'Comment ID and content are required.' });
            }

            if (!mongoose.Types.ObjectId.isValid(commentId)) {
                return res.status(400).json({ message: 'Invalid comment ID.' });
            }

            const userId = req.session.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized.' });
            }

            const comment = await Comment.findOne({ _id: commentId, userId });

            if (!comment) {
                return res.status(404).json({
                    message: 'Comment not found or you do not own this comment.'
                });
            }

            // Update the comment content
            comment.content.push({ comment: content });
            comment.latestContent = {
                comment: content,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // if comment was deleted, set deleted to false
            comment.deleted = false;
            await comment.save();

            // Populate and return the edited comment
            const populatedComment = await Comment.populate(comment, {
                path: 'user',
                select: 'username profilePhotos latestProfilePhoto',
                model: User
            });

            res.status(200).json(populatedComment.toObject({ virtuals: true }));
        } catch (error: any) {
            console.error('Edit Comment Error:', error);
            res.status(500).json({
                message: 'Unable to edit the comment. Please try again.'
            });
        }
    }
);

export default edit_comment;
