import { Router } from 'express';
import mongoose from 'mongoose';

import Comment, { CommentDocument } from '@models/Comment';
import User, { UserDocument } from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';

import { MAX_COMMENT_DEPTH } from '@utils/constants';

const new_comment = Router();

new_comment.use(isAuthenticated);

new_comment.post('/new_comment', async (req, res) => {
    try {
        const { comment, slug, parentComment: parentId } = req.body as { comment: string, slug: string, parentComment?: string };

        if (!comment || !slug) return res.status(400).json({ message: "Content and slug are required." });

        const newComment: CommentDocument = new Comment({
            content: [{ comment }],
            slug,
            userId: req.session.userId,
            ...(parentId && { parentComment: new mongoose.Types.ObjectId(parentId) })
        });

        // now let's find the parent comment and add the id of this new comment to it
        if (parentId) {
            if (await getCommentDepth(parentId) >= MAX_COMMENT_DEPTH) return res.status(400).json({ message: "Reply depth limit reached." });

            const parentComment = await Comment.findOne<CommentDocument>({ _id: parentId });

            if (!parentComment) return res.status(404).json({ message: "Parent comment not found." });

            parentComment.childComments.push(newComment._id);

            await parentComment.save();
        }

        await newComment.save();

        await Comment.populate(newComment, {
            path: 'userId',
            select: 'username profilePhotos latestProfilePhoto',
            model: User
        })

        res.status(201).json(newComment.toObject({ virtuals: true }));

        console.log(newComment);
    } catch (error) {
        console.error("Comment Post Error:", error);
        res.status(500).json({ message: "Unable to post the comment. Please try again." });
    }
});

export default new_comment;

async function getCommentDepth(commentId: string, depth: number = 0): Promise<number> {
    const comment = await Comment.findOne<CommentDocument>({ _id: commentId });
    if (comment && comment.parentComment) {
        return getCommentDepth(comment.parentComment.toString(), depth + 1);
    }
    return depth;
}

/*
*/