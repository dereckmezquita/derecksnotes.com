import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';

import Comment, { CommentDocument } from '@models/Comment';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';

import geoLocate from '@utils/geoLocate';

import { MAX_COMMENT_DEPTH } from '@utils/constants';

const new_comment = Router();

new_comment.post('/new_comment', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const { comment, encodedSlug, parentComment: parentId } = req.body as { comment: string, encodedSlug: string, parentComment?: string };

        // Validate input
        if (!comment || !encodedSlug) {
            return res.status(400).json({ message: "Content and slug are required." });
        }

        if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
            return res.status(400).json({ message: "Invalid parent comment ID." });
        }

        const decodedSlug = decodeURIComponent(encodedSlug);

        const ip_address = req.headers['x-forwarded-for'] as string;

        const geolocation = await geoLocate(ip_address);

        // Create new comment
        const newComment = await createNewComment(comment, decodedSlug, geolocation, parentId, req.session.userId!);

        // Populate and return the new comment
        const populatedComment = await populateComment(newComment);
        res.status(201).json(populatedComment.toObject({ virtuals: true }));

    } catch (error) {
        handleCommentPostError(error, res);
    }
});

export default new_comment;

async function createNewComment(comment: string, decodedSlug: string, geolocation: GeolocationDTO, parentId: string | undefined, userId: string): Promise<CommentDocument> {
    const newComment: CommentDocument = new Comment({
        content: [{ comment }],
        slug: decodedSlug,
        userId,
        ...(parentId && { parentComment: new mongoose.Types.ObjectId(parentId) }),
        geolocation
    });

    if (parentId) {
        await attachToParentComment(newComment, parentId);
    }

    await newComment.save();
    return newComment;
}

async function attachToParentComment(newComment: CommentDocument, parentId: string) {
    if (await getCommentDepth(parentId) >= MAX_COMMENT_DEPTH) {
        throw new ReplyDepthLimitError("Reply depth limit reached.");
    }

    const parentComment = await Comment.findOne<CommentDocument>({ _id: parentId });
    if (!parentComment) {
        throw new ParentCommentNotFoundError("Parent comment not found.");
    }

    parentComment.childComments.push(newComment._id);
    await parentComment.save();
}

async function populateComment(comment: CommentDocument): Promise<CommentDocument> {
    return Comment.populate(comment, {
        path: 'user',
        select: 'username profilePhotos latestProfilePhoto',
        model: User
    });
}

function handleCommentPostError(error: any, res: Response) {
    console.error("Comment Post Error:", error);

    if (error instanceof ReplyDepthLimitError || error instanceof ParentCommentNotFoundError) {
        return res.status(400).json({ message: error.message });
    }

    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Unable to post the comment. Please try again." });
}

async function getCommentDepth(commentId: string, depth: number = 0): Promise<number> {
    const comment = await Comment.findOne<CommentDocument>({ _id: commentId });
    if (comment && comment.parentComment) {
        return getCommentDepth(comment.parentComment.toString(), depth + 1);
    }
    return depth;
}

// ------------------ Error Classes ------------------
class ReplyDepthLimitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ReplyDepthLimitError';
    }
}

class ParentCommentNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ParentCommentNotFoundError';
    }
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