import { Router } from 'express';

import CommentInfo from '@models/CommentInfo';
import isAuthenticated from '@utils/middleware/isAuthenticated';
import mongoose from 'mongoose';

const delete_comments = Router();

delete_comments.use(isAuthenticated);

delete_comments.delete('/delete_comments', async (req, res) => {
    // instead of deleting the comment set the content to [deleted]
    try {
        const { commentIds } = req.body as { commentIds: string[] };

        if (!commentIds || !Array.isArray(commentIds)) return res.status(400).json({ message: "Comment Ids are required." });

        const userId = req.session.userId;

        if (!userId) return res.status(401).json({ message: "Unauthorized." });

        await CommentInfo.deleteManyOwnedByUser(commentIds, userId);
    } catch(error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default delete_comments;