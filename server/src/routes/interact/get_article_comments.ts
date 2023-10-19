import express from 'express';
import Comment, { CommentDocument } from '@models/Comment';
import buildPopulateObject from '@utils/buildPopulateObject';

const get_article_comments = express.Router();

get_article_comments.get('/get_article_comments/:slug', async (req, res) => {
    const { slug } = req.params;
    // forward slashes are replaced with _ in the client
    // const decodedSlug = decodeURIComponent(encodedSlug);

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

        const comments = await Comment.find({
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

        const commentsObj: CommentPopUserDTO[] = comments.map((comment: CommentDocument) => {
            return comment.toObject({ virtuals: true });
        });

        // console.log(JSON.stringify(comments));

        const message: CommentsBySlugDTO = {
            comments: commentsObj,
            hasMore: total > page * limit, // only applies to top-level comments
        }

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default get_article_comments;

/*
Server sent:
[{"_id":"651a268152a74cbb77538a57","childComments":[{"_id":"651a268652a74cbb77538a60","childComments":[{"_id":"651a269552a74cbb77538a7a","childComments":[{"_id":"651a26a452a74cbb77538a9f","childComments":[],"parentComment":"651a269552a74cbb77538a7a","reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"ddd","_id":"651a26a452a74cbb77538aa0","createdAt":"2023-10-02T02:10:44.953Z","updatedAt":"2023-10-02T02:10:44.953Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"createdAt":"2023-10-02T02:10:44.953Z","updatedAt":"2023-10-02T02:10:44.953Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"ddd","_id":"651a26a452a74cbb77538aa0","createdAt":"2023-10-02T02:10:44.953Z","updatedAt":"2023-10-02T02:10:44.953Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"651a26a452a74cbb77538a9f"}],"parentComment":"651a268652a74cbb77538a60","reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"ccc","_id":"651a269552a74cbb77538a7b","createdAt":"2023-10-02T02:10:29.370Z","updatedAt":"2023-10-02T02:10:29.370Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"createdAt":"2023-10-02T02:10:29.377Z","updatedAt":"2023-10-02T02:10:44.951Z","__v":1,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"ccc","_id":"651a269552a74cbb77538a7b","createdAt":"2023-10-02T02:10:29.370Z","updatedAt":"2023-10-02T02:10:29.370Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"651a269552a74cbb77538a7a"}],"parentComment":"651a268152a74cbb77538a57","reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"bbb","_id":"651a268652a74cbb77538a61","createdAt":"2023-10-02T02:10:14.873Z","updatedAt":"2023-10-02T02:10:14.873Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"createdAt":"2023-10-02T02:10:14.873Z","updatedAt":"2023-10-02T02:10:29.354Z","__v":1,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"bbb","_id":"651a268652a74cbb77538a61","createdAt":"2023-10-02T02:10:14.873Z","updatedAt":"2023-10-02T02:10:14.873Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"651a268652a74cbb77538a60"}],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"aaa","_id":"651a268152a74cbb77538a58","createdAt":"2023-10-02T02:10:09.459Z","updatedAt":"2023-10-02T02:10:09.459Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"createdAt":"2023-10-02T02:10:09.459Z","updatedAt":"2023-10-02T02:10:14.865Z","__v":1,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"aaa","_id":"651a268152a74cbb77538a58","createdAt":"2023-10-02T02:10:09.459Z","updatedAt":"2023-10-02T02:10:09.459Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"651a268152a74cbb77538a57"}]
---
Client received:
{"comments":[{"_id":"651a268152a74cbb77538a57","childComments":[{"_id":"651a268652a74cbb77538a60","childComments":[{"_id":"651a269552a74cbb77538a7a","childComments":[{"_id":"651a26a452a74cbb77538a9f","childComments":[],"parentComment":"651a269552a74cbb77538a7a","reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"ddd","_id":"651a26a452a74cbb77538aa0","createdAt":"2023-10-02T02:10:44.953Z","updatedAt":"2023-10-02T02:10:44.953Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"createdAt":"2023-10-02T02:10:44.953Z","updatedAt":"2023-10-02T02:10:44.953Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"ddd","_id":"651a26a452a74cbb77538aa0","createdAt":"2023-10-02T02:10:44.953Z","updatedAt":"2023-10-02T02:10:44.953Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"651a26a452a74cbb77538a9f"}],"parentComment":"651a268652a74cbb77538a60","reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"ccc","_id":"651a269552a74cbb77538a7b","createdAt":"2023-10-02T02:10:29.370Z","updatedAt":"2023-10-02T02:10:29.370Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"createdAt":"2023-10-02T02:10:29.377Z","updatedAt":"2023-10-02T02:10:44.951Z","__v":1,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"ccc","_id":"651a269552a74cbb77538a7b","createdAt":"2023-10-02T02:10:29.370Z","updatedAt":"2023-10-02T02:10:29.370Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"651a269552a74cbb77538a7a"}],"parentComment":"651a268152a74cbb77538a57","reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"bbb","_id":"651a268652a74cbb77538a61","createdAt":"2023-10-02T02:10:14.873Z","updatedAt":"2023-10-02T02:10:14.873Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"createdAt":"2023-10-02T02:10:14.873Z","updatedAt":"2023-10-02T02:10:29.354Z","__v":1,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"bbb","_id":"651a268652a74cbb77538a61","createdAt":"2023-10-02T02:10:14.873Z","updatedAt":"2023-10-02T02:10:14.873Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"651a268652a74cbb77538a60"}],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"aaa","_id":"651a268152a74cbb77538a58","createdAt":"2023-10-02T02:10:09.459Z","updatedAt":"2023-10-02T02:10:09.459Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"createdAt":"2023-10-02T02:10:09.459Z","updatedAt":"2023-10-02T02:10:14.865Z","__v":1,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"aaa","_id":"651a268152a74cbb77538a58","createdAt":"2023-10-02T02:10:09.459Z","updatedAt":"2023-10-02T02:10:09.459Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"651a268152a74cbb77538a57"}],"hasMore":false}
*/