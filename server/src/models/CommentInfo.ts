import { ObjectId } from "mongodb";
import mongoose from "mongoose";

import sanitizeHtml from 'sanitize-html';

const commentSubSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10000,
    }
}, {
    timestamps: true // adds createdAt and updatedAt
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
            required: true
        },
        default: {}
    },
    deleted: { type: Boolean, default: false }
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
        let trimmedContent = comment.content[lastCommentIndex].content.trim();

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

        comment.content[lastCommentIndex].content = sanitizedContent;
    }

    next();
});


// ---------------------------------------
// virtuals
// ---------------------------------------
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

// ---------------------------------------
// methods
// ---------------------------------------
// ---- instance methods ----
/*
const comment = await CommentInfo.findById(someId);
const latest = comment.latestContent();
*/
commentInfoSchema.methods.latestContent = function () {
    return this.content[this.content.length - 1];
};

/*
const comment = await CommentInfo.findById(commentId);
comment.setJudgement(someUserId, 'like'); // or 'dislike'
await comment.save();
*/
commentInfoSchema.methods.setJudgement = function (userId: string, judgement: 'like' | 'dislike') {
    this.judgement.set(userId, judgement);
}

// ---- static methods ----
/* const userComments = await CommentInfo.findByUser(someUserId); */
commentInfoSchema.statics.findByUser = function (userId) {
    return this.find({ userId });
};

// ---------------------------------------
// interface for adding virtuals and methods
interface CommentInfoDocument extends mongoose.Document {
    judgement: Map<string, 'like' | 'dislike'>;
    likesCount: number;
    dislikesCount: number;
    totalJudgement: number;
    latestContent: () => { content: string, createdAt: Date, updatedAt: Date };
    setJudgement: (userId: string, judgement: 'like' | 'dislike') => void;
    // ... any other methods or virtuals you add
}

const CommentInfo = mongoose.model<CommentInfoDocument>('Comment', commentInfoSchema);

export default CommentInfo;