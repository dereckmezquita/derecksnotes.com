import express from 'express';
import CommentInfo from '../../models/CommentInfo';  // Adjust the import path accordingly.

const router = express.Router();

router.get('/get_article_comments/:slug', async (req, res) => {
    const { slug } = req.params;
    const limit = Number(req.query.limit) || 10;  // default to 10 if limit isn't provided
    const page = Number(req.query.page) || 1;

    try {
        const skip = (page - 1) * limit;

        // Fetch comments based on the slug and paginate using skip and limit
        const comments = await CommentInfo.find({ slug })
            .sort({ "createdAt": -1 })
            .skip(skip)
            .limit(limit);

        // Additionally, you can return the total number of comments for this article for frontend pagination purposes
        const total = await CommentInfo.countDocuments({ slug });

        res.json({
            comments,
            total,
            hasMore: total > page * limit
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;