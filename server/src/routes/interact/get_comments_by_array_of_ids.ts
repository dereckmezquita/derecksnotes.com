import express from 'express';
import CommentInfo from '@models/CommentInfo';
import mongoose from 'mongoose';

const get_comments_by_array_of_ids = express.Router();

get_comments_by_array_of_ids.post('/get_comments_by_array_of_ids', async (req, res) => {
    const commentIds = req.body.commentIds;
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    if (!Array.isArray(commentIds)) return res.status(400).json({ message: 'commentIds must be an array of strings.' });    

    let dateFilter = {};
    if (startDate && endDate) {
        dateFilter = { "createdAt": { $gte: startDate, $lte: endDate } };
    }

    try {
        const skip = (page - 1) * limit;

        // Fetch comments based on the provided IDs and paginate using skip and limit
        const comments = await CommentInfo.find<CommentInfo[] & mongoose.Document[]>({ _id: { $in: commentIds }, ...dateFilter })
            .sort({ "createdAt": -1 })
            .skip(skip)
            .limit(limit);

        // Additionally, you can return the total number of comments that match the provided IDs
        const total = await CommentInfo.countDocuments({ _id: { $in: commentIds } });

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

export default get_comments_by_array_of_ids;