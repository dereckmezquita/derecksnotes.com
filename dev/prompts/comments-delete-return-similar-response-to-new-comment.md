Wonderful this works now. Now help me to update my delete_comment end point so it returns something similar to the new_comment/get_article_comments end point.

```ts
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
*/
```

```ts
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
        const comments = await CommentInfo.find<CommentInfo & mongoose.Document>({ slug, parentComment: null, ...dateFilter })
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
        const total = await CommentInfo.countDocuments({ slug, parentComment: null });

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
```

```ts
import { Router } from 'express';

import CommentInfo from '@models/CommentInfo';
import isAuthenticated from '@utils/middleware/isAuthenticated';
import mongoose from 'mongoose';

const delete_comments = Router();

delete_comments.use(isAuthenticated);

delete_comments.delete('/delete_comments', async (req, res) => {
    // instead of deleting the comment set the content to [deleted]
    try {
        const { commentIds } = req.body as { commentIds: string[] };

        if (!commentIds || !Array.isArray(commentIds)) return res.status(400).json({ message: "Comment Ids are required." });

        const userId = req.session.userId;

        if (!userId) return res.status(401).json({ message: "Unauthorized." });

        await CommentInfo.deleteManyOwnedByUser(commentIds, userId);

        res.status(201).json
    } catch(error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default delete_comments;

```

Here is the schema which shows you my static method for deleting comments:

```ts
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

import sanitizeHtml from 'sanitize-html';

export const commentSubSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10000,
    }
}, {
    timestamps: true, // adds createdAt and updatedAt
    id: false
});


const commentInfoSchema = new mongoose.Schema({
    childComments: {
        type: [ObjectId],
        ref: 'CommentInfo',
        default: [],
    },
    parentComment: {
        type: ObjectId,
        ref: 'CommentInfo',
        default: null,
    },
    reportTarget: { // only added if the comment itself is a report of another comment
        type: ObjectId,
        ref: 'CommentInfo',
        default: null,
    },
    mentions: {
        type: [ObjectId], // the _id of the user
        ref: 'User',
        default: [],
    },
    slug: { type: String, required: true }, // slugs must be unique
    content: {
        type: [commentSubSchema],
        required: true,
        default: [],
    },
    userId: {
        type: ObjectId, // _id of the user
        required: true,
        ref: 'User',
    },
    judgement: { // likes/dislikes by users using Map structure
        type: Map,
        of: {
            type: String,
            enum: ['like', 'dislike'],
        },
        default: {}
    },
    deleted: { type: Boolean, default: false },
}, {
    timestamps: true, // adds createdAt and updatedAt
});

// ---------------------------------------
// pre save hooks
// ---------------------------------------
// trim the comment before saving and sanitize it
commentInfoSchema.pre('save', function (next) {
    const comment = this; // Now 'this' refers to the entire commentInfoSchema
    const lastCommentIndex = comment.content.length - 1;

    if (comment.content[lastCommentIndex]) {
        // Trim the content
        let trimmedContent = comment.content[lastCommentIndex].comment.trim();

        // Sanitize the content
        let sanitizedContent = sanitizeHtml(trimmedContent, {
            allowedTags: [
                'b', 'i', 'u', 's', 'em', 'strong',
                'ul', 'ol', 'li', 'a', 'blockquote',
                'code', 'pre', 'br'
            ],
            allowedAttributes: {
                'a': ['href'],
                'blockquote': ['cite']
            }
        });

        comment.content[lastCommentIndex].comment = sanitizedContent;
    }

    next();
});


// ---------------------------------------
// virtuals
// ---------------------------------------
/*
const comment = await CommentInfo.findById(someId);
console.log(comment.likesCount);
*/
commentInfoSchema.virtual('likesCount').get(function (this: CommentInfoDocument) {
    let count = 0;
    for (let [, judgement] of this.judgement) {
        if (judgement === 'like') count++;
    }
    return count;
});

commentInfoSchema.virtual('dislikesCount').get(function (this: CommentInfoDocument) {
    let count = 0;
    for (let [, judgement] of this.judgement) {
        if (judgement === 'dislike') count++;
    }
    return count;
});

// need to add virtuals to the interface
commentInfoSchema.virtual('totalJudgement').get(function (this: CommentInfoDocument) {
    return this.likesCount - this.dislikesCount;
});

/*
const comment = await CommentInfo.findById(someId);
console.log(comment.latestConten);
*/
commentInfoSchema.virtual('latestContent').get(function () {
    return this.content[this.content.length - 1];
});

// ---------------------------------------
// methods
// ---------------------------------------
// ---- instance methods ----
commentInfoSchema.methods.setJudgement = function (userId: string, judgement: 'like' | 'dislike') {
    this.judgement.set(userId, judgement);
}

commentInfoSchema.methods.markAsDeleted = function(this: CommentInfoDocument, userId: string) {
    if (this.userId.toString() !== userId) {
        throw new Error("You do not own this comment.");
    }

    const lastCommentIndex = this.content.length - 1;

    if (this.content[lastCommentIndex].comment === "[deleted]") {
        throw new Error("This comment has already been deleted.");
    }

    this.content.push({ comment: "[deleted]" });
}

// ---- static methods ----
commentInfoSchema.statics.deleteManyOwnedByUser = async function(this: any, commentIds: string[], userId: string) {
    const comments = await this.find({ _id: { $in: commentIds }, userId });

    if (comments.length !== commentIds.length) {
        throw new Error("Some comments do not belong to this user or do not exist.");
    }

    const promises = comments.map(async (comment: any) => {
        comment.markAsDeleted(userId);
        return comment.save();
    });

    await Promise.all(promises);
};


/* const userComments = await CommentInfo.findByUser(someUserId); */
commentInfoSchema.statics.findByUser = function (userId) {
    return this.find({ userId });
};

/* const numCommentsByUser = await CommentInfo.countByUser(someUserId); */
commentInfoSchema.statics.countByUser = function (userId) {
    return this.countDocuments({ userId });
};

/* 
get comments judged by a user
const commentsJudged = await CommentInfo.findByUser(someUserId);
*/
commentInfoSchema.statics.commentsJudgedByUser = async function (userId) {
    const comments = await this.find({ [`judgement.${userId}`]: { $exists: true } });
    return comments || [];
};

// ---------------------------------------
// interface for adding virtuals and methods
interface CommentInfoModel extends mongoose.Model<CommentInfoDocument> {
    deleteManyOwnedByUser: (commentIds: string[], userId: string) => Promise<void>;
    findByUser: (userId: string) => Promise<CommentInfoDocument[]>;
    countByUser: (userId: string) => Promise<number>;
    commentsJudgedByUser: (userId: string) => Promise<CommentInfoDocument[]>;
    // ... any other static methods you add
}

interface CommentInfoDocument extends mongoose.Document {
    userId: ObjectId;
    content: { comment: string }[];
    judgement: Map<string, 'like' | 'dislike'>;
    likesCount: number;
    dislikesCount: number;
    totalJudgement: number;
    latestContent: () => { content: string, createdAt: Date, updatedAt: Date };
    setJudgement: (userId: string, judgement: 'like' | 'dislike') => void;
    markAsDeleted: (userId: string) => void;
    // ... any other methods or virtuals you add
}

const CommentInfo = mongoose.model<CommentInfoDocument, CommentInfoModel>('Comment', commentInfoSchema);

export default CommentInfo;
```