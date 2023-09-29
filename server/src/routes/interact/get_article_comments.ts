import express from 'express';
import CommentInfo from '@models/CommentInfo';

const get_article_comments = express.Router();

get_article_comments.get('/get_article_comments/:slug', async (req, res) => {
    const { slug } = req.params;
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    let dateFilter = {};
    if (startDate && endDate) {
        dateFilter = { "createdAt": { $gte: startDate, $lte: endDate } };
    }

    try {
        const skip = (page - 1) * limit;

        // Fetch comments based on the slug and paginate using skip and limit
        const comments = await CommentInfo.find({ slug, ...dateFilter })
            .sort({ "createdAt": -1 })
            .skip(skip)
            .limit(limit);

        // Additionally, you can return the total number of comments for this article for frontend pagination purposes
        const total = await CommentInfo.countDocuments({ slug });

        const message: CommentInfoResponse = {
            comments: comments.map((comment: any) => {
                const commentObj = comment.toObject({
                    virtuals: true,
                    versionKey: false
                });
                delete commentObj.id; // Remove the 'id' field
                return commentObj;
            }),
            total,
            hasMore: total > page * limit
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default get_article_comments;