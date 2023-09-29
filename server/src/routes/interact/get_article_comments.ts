import express from 'express';
import CommentInfo from '@models/CommentInfo';
import User from '@models/User';
import mongoose from 'mongoose';

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
        const comments = await CommentInfo.find<CommentInfo & mongoose.Document>({ slug, ...dateFilter })
            .sort({ "createdAt": -1 })
            .skip(skip)
            .limit(limit);

        // getting username and profile photos
        const userIds: string[] = comments.map(comment => comment.userId);

        // Fetch usernames and latest profile photos using $in operator
        const users = await User.find({ '_id': { $in: userIds } }) as { _id: string, username: string, latestProfilePhoto: string }[] & mongoose.Document[];

        const userMap = users.reduce((acc: any, user) => {
            acc[user._id.toString()] = { username: user.username, latestProfilePhoto: user.latestProfilePhoto };
            return acc;
        }, {});

        // Map through the comments and add username and latestProfilePhoto
        const enrichedComments = comments.map(comment => {
            const commentObj = comment.toObject({ virtuals: true, versionKey: false });
            delete commentObj.id;

            // Attach username and latestProfilePhoto
            if (userMap[commentObj.userId]) {
                commentObj.username = userMap[commentObj.userId].username;
                commentObj.latestProfilePhoto = userMap[commentObj.userId].latestProfilePhoto;
            }

            return commentObj;
        });

        // Additionally, return the total number of comments for this article for frontend pagination purposes
        const total = await CommentInfo.countDocuments({ slug });

        const message: CommentInfoResponse = {
            comments: enrichedComments,
            total,
            hasMore: total > page * limit
        }

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default get_article_comments;

/*
{
    "comments": [
        {
            "_id": "6516334978a1c4f861ecc94a",
            "childComments": [],
            "parentComment": null,
            "reportTarget": null,
            "mentions": [],
            "slug": "chemistry_general-chemistry_a_acid",
            "content": [
                {
                    "comment": "Some first comment!",
                    "_id": "6516334978a1c4f861ecc94b",
                    "createdAt": "2023-09-29T02:15:37.991Z",
                    "updatedAt": "2023-09-29T02:15:37.991Z"
                }
            ],
            "userId": "65150eaf09acd7d63838949b",
            "judgement": {},
            "deleted": false,
            "createdAt": "2023-09-29T02:15:37.991Z",
            "updatedAt": "2023-09-29T02:15:37.991Z",
            "likesCount": 0,
            "dislikesCount": 0,
            "totalJudgement": 0,
            "latestContent": {
                "comment": "Some first comment!",
                "_id": "6516334978a1c4f861ecc94b",
                "createdAt": "2023-09-29T02:15:37.991Z",
                "updatedAt": "2023-09-29T02:15:37.991Z"
            },
            "username": "dereck",
            "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg"
        }
    ],
    "total": 1,
    "hasMore": false
}
*/