import { Router } from 'express';
import CommentInfo from '@models/CommentInfo';
import isAuthenticated from '@utils/middleware/isAuthenticated';

const new_comment = Router();

new_comment.use(isAuthenticated);

new_comment.post('/new_comment', async (req, res) => {
    try {
        const { content, slug, parentComment } = req.body;

        if (!content || !slug) {
            return res.status(400).json({ message: "Content and slug are required." });
        }

        const newComment = new CommentInfo({
            content: [{ content }],
            slug,
            userId: req.session.userId,
            ...(parentComment && { parentComment })
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);

    } catch (error) {
        console.error("Comment Post Error:", error);
        res.status(500).json({ message: "Unable to post the comment. Please try again." });
    }
});

export default new_comment;