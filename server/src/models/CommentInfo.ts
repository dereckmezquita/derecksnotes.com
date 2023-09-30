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
/*
const comment = await CommentInfo.findById(commentId);
comment.setJudgement(someUserId, 'like'); // or 'dislike'
await comment.save();
*/
commentInfoSchema.methods.setJudgement = function (userId: string, judgement: 'like' | 'dislike') {
    this.judgement.set(userId, judgement);
}

/*
const userId = req.session.userId;
const comments = await CommentInfo.find({ _id: { $in: arrayOfCommentIds } });
comments.delete(userId);
// this method does 2 things; this method allows deletion of an array of comments
// 1. checks the current user owns the comment
// 2. adds a new comment to the content array with the comment set to [deleted]
// 3. if the latest content is already [deleted] it will not add another one; throws error instead informing user
*/
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