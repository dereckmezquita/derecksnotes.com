import { Router } from 'express';
import mongoose from 'mongoose';

import Comment, { CommentDocument } from '@models/Comment';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';

import { MAX_COMMENT_DEPTH } from '@utils/constants';

const new_comment = Router();

new_comment.post('/new_comment', isAuthenticated, async (req, res) => {
    try {
        const { comment, slug, parentComment: parentId } = req.body as { comment: string, slug: string, parentComment?: string };

        if (!comment || !slug) {
            return res.status(400).json({ message: "Content and slug are required." });
        }

        const newComment: CommentDocument = new Comment({
            content: [{ comment }],
            slug,
            userId: req.session.userId,
            ...(parentId && { parentComment: new mongoose.Types.ObjectId(parentId) })
        });

        // now let's find the parent comment and add the id of this new comment to it
        if (parentId) {
            if (await getCommentDepth(parentId) >= MAX_COMMENT_DEPTH) {
                return res.status(400).json({ message: "Reply depth limit reached." });
            }

            const parentComment = await Comment.findOne<CommentDocument>({ _id: parentId });

            if (!parentComment) {
                return res.status(404).json({ message: "Parent comment not found." });
            }

            parentComment.childComments.push(newComment._id);

            await parentComment.save();
        }

        await newComment.save();

        const popObj = (await Comment.populate(newComment, {
            path: 'user',
            select: 'username profilePhotos latestProfilePhoto',
            model: User
        })).toObject({ virtuals: true })

        // console.log(JSON.stringify(popObj));

        res.status(201).json(popObj);
    } catch (error) {
        console.error("Comment Post Error:", error);
        res.status(500).json({ message: "Unable to post the comment. Please try again." });
    }
});

export default new_comment;

async function getCommentDepth(commentId: string, depth: number = 0): Promise<number> {
    const comment = await Comment.findOne<CommentDocument>({ _id: commentId });
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
      comment: 'mmm',
      _id: new ObjectId("651f78994c0a204990c13782"),
      createdAt: 2023-10-06T03:01:45.483Z,
      updatedAt: 2023-10-06T03:01:45.483Z
    }
  ],
  userId: new ObjectId("65150eaf09acd7d63838949b"),
  judgement: Map(0) {},
  deleted: false,
  _id: new ObjectId("651f78994c0a204990c13781"),
  createdAt: 2023-10-06T03:01:45.483Z,
  updatedAt: 2023-10-06T03:01:45.483Z,
  __v: 0,
  likesCount: 0,
  dislikesCount: 0,
  totalJudgement: 0,
  latestContent: {
    comment: 'mmm',
    _id: new ObjectId("651f78994c0a204990c13782"),
    createdAt: 2023-10-06T03:01:45.483Z,
    updatedAt: 2023-10-06T03:01:45.483Z
  },
  user: {
    _id: new ObjectId("65150eaf09acd7d63838949b"),
    profilePhotos: [
      'optimised_dereck_2023-09-28-162359.jpg',
      'optimised_dereck_2023-10-04-024459.png'
    ],
    username: 'dereck',
    latestProfilePhoto: 'optimised_dereck_2023-10-04-024459.png',
    id: '65150eaf09acd7d63838949b'
  },
  latestProfilePhoto: 'optimised_dereck_2023-10-04-024459.png',
  id: '651f78994c0a204990c13781'
}
Client received:
{"childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"mmm","_id":"651f78994c0a204990c13782","createdAt":"2023-10-06T03:01:45.483Z","updatedAt":"2023-10-06T03:01:45.483Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"_id":"651f78994c0a204990c13781","createdAt":"2023-10-06T03:01:45.483Z","updatedAt":"2023-10-06T03:01:45.483Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"mmm","_id":"651f78994c0a204990c13782","createdAt":"2023-10-06T03:01:45.483Z","updatedAt":"2023-10-06T03:01:45.483Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg","optimised_dereck_2023-10-04-024459.png"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-10-04-024459.png","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-10-04-024459.png","id":"651f78994c0a204990c13781"}
*/