import { Router } from 'express';
import mongoose from 'mongoose';

import CommentInfo from '@models/CommentInfo';
import isAuthenticated from '@utils/middleware/isAuthenticated';

import { MAX_COMMENT_DEPTH } from '@utils/constants';

const new_comment = Router();

new_comment.use(isAuthenticated);

new_comment.post('/new_comment', async (req, res) => {
    try {
        const { comment, slug, parentComment: parentId } = req.body as { comment: string, slug: string, parentComment?: string };

        console.log("Received: ", { comment, slug, parentId });

        if (!comment || !slug) return res.status(400).json({ message: "Content and slug are required." });

        const newComment = new CommentInfo({
            content: [{ comment }],
            slug,
            userId: req.session.userId,
            ...(parentId && { parentComment: new mongoose.Types.ObjectId(parentId) })
        });

        // now let's find the parent comment and add the id of this new comment to it
        if (parentId) {
            if (await getCommentDepth(parentId) >= MAX_COMMENT_DEPTH) return res.status(400).json({ message: "Reply depth limit reached." });

            const parentComment = await CommentInfo.findOne<CommentInfo & mongoose.Document>({ _id: parentId });

            if (!parentComment) return res.status(404).json({ message: "Parent comment not found." });

            parentComment.childComments.push(newComment._id);

            await parentComment.save();
        }

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.error("Comment Post Error:", error);
        res.status(500).json({ message: "Unable to post the comment. Please try again." });
    }
});

export default new_comment;

async function getCommentDepth(commentId: string, depth: number = 0): Promise<number> {
    const comment = await CommentInfo.findOne<CommentInfo & mongoose.Document>({ _id: commentId });
    if (comment && comment.parentComment) {
        return getCommentDepth(comment.parentComment.toString(), depth + 1);
    }
    return depth;
}