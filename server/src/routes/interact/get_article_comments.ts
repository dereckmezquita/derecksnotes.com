import express from 'express';
import User from '@models/User';
import Comment, { CommentDocument } from '@models/Comment';

const get_article_comments = express.Router();

get_article_comments.get('/get_article_comments/:slug', async (req, res) => {
    const { slug } = req.params;
    const limit = Number(req.query.limit) || 50;
    const page = Number(req.query.page) || 1;
    const depth = Number(req.query.depth) || 10; // max depth of child comments to populate
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    let dateFilter = {};
    if (startDate && endDate) {
        dateFilter = { "createdAt": { $gte: startDate, $lte: endDate } };
    } else if (startDate) {
        dateFilter = { "createdAt": { $gte: startDate } };
    } else if (endDate) {
        dateFilter = { "createdAt": { $lte: endDate } };
    }

    try {
        const skip = (page - 1) * limit;

        let comments = await Comment.find({
            slug,
            parentComment: null,
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
            ]).
            exec();

        const total: number = comments.length;

        comments = comments.map((comment: CommentDocument) => {
            return comment.toObject({ virtuals: true });
        });

        console.log(JSON.stringify(comments));

        const message: CommentInfoResponse = {
            comments: comments as any,
            hasMore: total > page * limit, // only applies to top-level comments
        }

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default get_article_comments;

function buildPopulateObject(depth: number): any {
    if (depth <= 0) {
        return null;
    }

    let populateChildren = buildPopulateObject(depth - 1);

    let result = {
        path: 'childComments',
        populate: [
            {
                path: 'user',
                model: 'User',
                select: 'profilePhotos username'
            }
        ]
    };

    if (populateChildren) {
        result.populate.push(populateChildren);
    }

    return result;
}