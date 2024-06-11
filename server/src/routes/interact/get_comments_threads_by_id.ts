import express from 'express';
import Comment, { CommentDocument } from '@models/Comment';
import buildPopulateObject from '@utils/buildPopulateObject';

const get_comments_threads_by_id = express.Router();

get_comments_threads_by_id.post(
    '/get_comments_threads_by_id',
    async (req, res) => {
        const commentIds = req.body.commentIds;
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const depth = Number(req.query.depth) || 10; // max depth of child comments to populate
        const startDate = req.query.startDate
            ? new Date(req.query.startDate as string)
            : undefined;
        const endDate = req.query.endDate
            ? new Date(req.query.endDate as string)
            : undefined;

        if (!Array.isArray(commentIds))
            return res
                .status(400)
                .json({ message: 'commentIds must be an array of strings.' });

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = { createdAt: { $gte: startDate, $lte: endDate } };
        } else if (startDate) {
            dateFilter = { createdAt: { $gte: startDate } };
        } else if (endDate) {
            dateFilter = { createdAt: { $lte: endDate } };
        }

        try {
            const skip = (page - 1) * limit;

            // each comment has UserId of the user that made the comment comment.UserId
            let comments = await Comment.find({
                _id: { $in: commentIds },
                ...dateFilter
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate([
                    {
                        path: 'user',
                        model: 'User',
                        select: 'profilePhotos username'
                    },
                    buildPopulateObject(depth)
                ])
                .exec();

            const total: number = comments.length;

            comments = comments.map((comment: CommentDocument) => {
                return comment.toObject({ virtuals: true });
            });

            // console.log(JSON.stringify(comments));

            const message: CommentsBySlugDTO = {
                comments: comments as any,
                hasMore: total > page * limit
            };

            res.status(200).json(message);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

export default get_comments_threads_by_id;
