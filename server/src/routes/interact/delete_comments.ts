import { Router } from 'express';

import CommentInfo from '@models/CommentInfo';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';
import mongoose, { mongo } from 'mongoose';

const delete_comments = Router();

delete_comments.use(isAuthenticated);

delete_comments.delete('/delete_comments', async (req, res) => {
    // instead of deleting the comment set the content to [deleted]
    try {
        const { commentIds } = req.body as { commentIds: string[] };

        if (!commentIds || !Array.isArray(commentIds)) return res.status(400).json({ message: "Comment Ids are required." });
        if (commentIds.length > 50) return res.status(400).json({ message: "Cannot delete more than 50 comments at once." });

        const userId = req.session.userId;

        if (!userId) return res.status(401).json({ message: "Unauthorized." });

        const deletedComments = await CommentInfo.deleteManyOwnedByUser(commentIds, userId);

        deletedComments.map(comment => {
            if (comment.userId.toString() !== userId) {
                return res.status(401).json({ message: `You do not own this comment: ${comment._id}` });
            }
        })

        // get the user's username and profile photo
        const userInfo = await User.findOne({ _id: userId }) as { username: string, latestProfilePhoto: string } & mongoose.Document;

        if (!userInfo) return res.status(404).json({ message: "User not found." });

        const username = userInfo.username;
        const latestProfilePhoto = userInfo.latestProfilePhoto;

        const enrichedDeletedComments = deletedComments.map(comment => {
            const commentObj = comment.toObject({ virtuals: true, versionKey: false });
            delete commentObj.id;

            commentObj.username = username;
            commentObj.latestProfilePhoto = latestProfilePhoto;

            return commentObj;
        });

        const message: CommentInfoResponse = {
            comments: enrichedDeletedComments,
            total: enrichedDeletedComments.length,
            hasMore: false
        }

        res.status(200).json(message);
    } catch(error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

export default delete_comments;

/*
Server sent:
{
  comments: [
    {
      _id: new ObjectId("651840f1d474044e8e419645"),
      childComments: [],
      parentComment: new ObjectId("6517a967d474044e8e419438"),
      reportTarget: null,
      mentions: [],
      slug: 'chemistry_general-chemistry_a_acid',
      content: [Array],
      userId: new ObjectId("65150eaf09acd7d63838949b"),
      judgement: Map(0) {},
      deleted: false,
      createdAt: 2023-09-30T15:38:25.997Z,
      updatedAt: 2023-09-30T17:42:02.474Z,
      likesCount: 0,
      dislikesCount: 0,
      totalJudgement: 0,
      latestContent: [Object],
      username: 'dereck',
      latestProfilePhoto: 'optimised_dereck_2023-09-28-162359.jpg'
    }
  ],
  total: 1,
  hasMore: false
}
---
Client received:
{
    "comments": [
        {
            "_id": "651843f0eb73faf752478262",
            "childComments": [],
            "parentComment": null,
            "reportTarget": null,
            "mentions": [],
            "slug": "chemistry_general-chemistry_a_acid",
            "content": [
                {
                    "comment": "Uber new comment.",
                    "_id": "651843f0eb73faf752478263",
                    "createdAt": "2023-09-30T15:51:12.763Z",
                    "updatedAt": "2023-09-30T15:51:12.763Z"
                },
                {
                    "comment": "[deleted]",
                    "_id": "65185e6ee309190fa7252328",
                    "createdAt": "2023-09-30T17:44:14.260Z",
                    "updatedAt": "2023-09-30T17:44:14.260Z"
                }
            ],
            "userId": "65150eaf09acd7d63838949b",
            "judgement": {},
            "deleted": false,
            "createdAt": "2023-09-30T15:51:12.764Z",
            "updatedAt": "2023-09-30T17:44:14.261Z",
            "likesCount": 0,
            "dislikesCount": 0,
            "totalJudgement": 0,
            "latestContent": {
                "comment": "[deleted]",
                "_id": "65185e6ee309190fa7252328",
                "createdAt": "2023-09-30T17:44:14.260Z",
                "updatedAt": "2023-09-30T17:44:14.260Z"
            },
            "username": "dereck",
            "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg"
        }
    ],
    "total": 1,
    "hasMore": false
}
*/