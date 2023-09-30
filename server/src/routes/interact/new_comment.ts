import { Router } from 'express';
import mongoose from 'mongoose';

import CommentInfo from '@models/CommentInfo';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';

import { MAX_COMMENT_DEPTH } from '@utils/constants';

const new_comment = Router();

new_comment.use(isAuthenticated);

new_comment.post('/new_comment', async (req, res) => {
    try {
        const { comment, slug, parentComment: parentId } = req.body as { comment: string, slug: string, parentComment?: string };

        if (!comment || !slug) return res.status(400).json({ message: "Content and slug are required." });

        const newComment = new CommentInfo({
            content: [{ comment }],
            slug,
            userId: req.session.userId,
            ...(parentId && { parentComment: new mongoose.Types.ObjectId(parentId) })
        });

        // now let's find the parent comment and add the id of this new comment to it
        if (parentId) {
            if (await getCommentDepth(parentId) >= MAX_COMMENT_DEPTH) return res.status(400).json({ message: "Reply depth limit reached." });

            const parentComment = await CommentInfo.findOne<CommentInfo & mongoose.Document>({ _id: parentId });

            if (!parentComment) return res.status(404).json({ message: "Parent comment not found." });

            parentComment.childComments.push(newComment._id);

            await parentComment.save();
        }

        const savedComment = await newComment.save();

        // getting username and profile photos
        const user = await User.findById(req.session.userId) as { _id: string, username: string, latestProfilePhoto: string } & mongoose.Document;

        const responseComment = {
            ...savedComment.toObject({ virtuals: true, versionKey: false }),
            username: user ? user.username : undefined,
            latestProfilePhoto: user ? user.latestProfilePhoto : undefined,
        };
        delete responseComment.id;

        res.status(201).json(responseComment);

        console.log(responseComment);
    } catch (error) {
        console.error("Comment Post Error:", error);
        res.status(500).json({ message: "Unable to post the comment. Please try again." });
    }
});

export default new_comment;

async function getCommentDepth(commentId: string, depth: number = 0): Promise<number> {
    const comment = await CommentInfo.findOne<CommentInfo & mongoose.Document>({ _id: commentId });
    if (comment && comment.parentComment) {
        return getCommentDepth(comment.parentComment.toString(), depth + 1);
    }
    return depth;
}

/*
Server sent:
{
  childComments: [],
  parentComment: null,
  reportTarget: null,
  mentions: [],
  slug: 'chemistry_general-chemistry_a_acid',
  content: [
    {
      comment: 'New comment received!',
      _id: new ObjectId("651845ba4a09f09cce03e027"),
      createdAt: 2023-09-30T15:58:50.518Z,
      updatedAt: 2023-09-30T15:58:50.518Z
    }
  ],
  userId: new ObjectId("65150eaf09acd7d63838949b"),
  judgement: Map(0) {},
  deleted: false,
  _id: new ObjectId("651845ba4a09f09cce03e026"),
  createdAt: 2023-09-30T15:58:50.518Z,
  updatedAt: 2023-09-30T15:58:50.518Z,
  likesCount: 0,
  dislikesCount: 0,
  totalJudgement: 0,
  latestContent: {
    comment: 'New comment received!',
    _id: new ObjectId("651845ba4a09f09cce03e027"),
    createdAt: 2023-09-30T15:58:50.518Z,
    updatedAt: 2023-09-30T15:58:50.518Z
  },
  username: 'dereck',
  latestProfilePhoto: 'optimised_dereck_2023-09-28-162359.jpg'
}
---
Client received:
{
    "childComments": [],
    "parentComment": null,
    "reportTarget": null,
    "mentions": [],
    "slug": "chemistry_general-chemistry_a_acid",
    "content": [
        {
            "comment": "New comment received!",
            "_id": "651845ba4a09f09cce03e027",
            "createdAt": "2023-09-30T15:58:50.518Z",
            "updatedAt": "2023-09-30T15:58:50.518Z"
        }
    ],
    "userId": "65150eaf09acd7d63838949b",
    "judgement": {},
    "deleted": false,
    "_id": "651845ba4a09f09cce03e026",
    "createdAt": "2023-09-30T15:58:50.518Z",
    "updatedAt": "2023-09-30T15:58:50.518Z",
    "likesCount": 0,
    "dislikesCount": 0,
    "totalJudgement": 0,
    "latestContent": {
        "comment": "New comment received!",
        "_id": "651845ba4a09f09cce03e027",
        "createdAt": "2023-09-30T15:58:50.518Z",
        "updatedAt": "2023-09-30T15:58:50.518Z"
    },
    "username": "dereck",
    "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg"
}
*/