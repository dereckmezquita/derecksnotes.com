import mongoose, { Model, Types, Document } from "mongoose";

import sanitizeHtml from 'sanitize-html';

export const ContentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10000,
    }
}, {
    timestamps: true, // adds createdAt and updatedAt
    id: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

export const Content = mongoose.model('Content', ContentSchema);

const CommentSchema = new mongoose.Schema({
    childComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: [],
    }],
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    reportTarget: { // only added if the comment itself is a report of another comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    mentions: [{
        type: mongoose.Schema.Types.ObjectId, // the _id of the user
        ref: 'User',
    }],
    slug: { type: String, required: true }, // slugs must be unique
    content: [{
        type: ContentSchema,
        required: true,
        default: [],
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId, // _id of commenter
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
CommentSchema.pre('save', function (this: CommentDocument, next) {
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
CommentSchema.virtual('likesCount').get(function (this: CommentDocument) {
    let count = 0;
    for (let [, judgement] of this.judgement) {
        if (judgement === 'like') count++;
    }
    return count;
});

CommentSchema.virtual('dislikesCount').get(function (this: CommentDocument) {
    let count = 0;
    for (let [, judgement] of this.judgement) {
        if (judgement === 'dislike') count++;
    }
    return count;
});

// need to add virtuals to the interface
CommentSchema.virtual('totalJudgement').get(function (this: CommentDocument) {
    return this.likesCount - this.dislikesCount;
});

/*
const comment = await CommentInfo.findById(someId);
console.log(comment.latestConten);
*/
CommentSchema.virtual('latestContent').get(function () {
    return this.content[this.content.length - 1];
});

/*
get user info on comment
*/
CommentSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
})

CommentSchema.virtual('latestProfilePhoto').get(function (this: any) {
    if (this.user && this.user.latestProfilePhoto) {
        return this.user.latestProfilePhoto;
    }
    return null;
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
CommentSchema.methods.setJudgement = function (userId: string, judgement: 'like' | 'dislike') {
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
CommentSchema.methods.markAsDeleted = function (this: CommentDocument, userId: string) {
    if (this.userId.toString() !== userId) {
        throw new Error("You do not own this comment.");
    }

    if (this.content[this.content.length - 1].comment === "[deleted]") {
        throw new Error("This comment has already been deleted.");
    }

    this.content.push({ comment: "[deleted]" });
    // the array should be max length of 30; pop off old comments
    if (this.content.length > 30) {
        this.content.shift();
    }
}

// ---- static methods ----
CommentSchema.statics.deleteManyOwnedByUser = async function (this: any, commentIds: string[], userId: string) {
    const comments = await this.find({ _id: { $in: commentIds }, userId });

    if (comments.length !== commentIds.length) {
        throw new Error("Some comments do not belong to this user or do not exist.");
    }

    const promises = comments.map(async (comment: any) => {
        comment.markAsDeleted(userId);
        return comment.save();
    });

    return await Promise.all(promises);
};


/* const userComments = await CommentInfo.findByUser(someUserId); */
CommentSchema.statics.findByUser = function (userId) {
    return this.find({ userId });
};

/* const numCommentsByUser = await CommentInfo.countByUser(someUserId); */
CommentSchema.statics.countByUser = function (userId) {
    return this.countDocuments({ userId });
};

/* 
get comments judged by a user
const commentsJudged = await CommentInfo.findByUser(someUserId);
*/
CommentSchema.statics.commentsJudgedByUser = async function (userId) {
    const comments = await this.find({ [`judgement.${userId}`]: { $exists: true } });
    return comments || [];
};

// ---------------------------------------
//document interface
interface Content {
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// FYI: be sure to import Document from mongoose
// or else errors on doc.toObject()
export interface CommentDocument extends Document {
    childComments: Types.ObjectId[] | CommentDocument[];
    parentComment: Types.ObjectId | null;
    reportTarget: Types.ObjectId | null;
    mentions: Types.ObjectId[];
    slug: string;
    content: Content[];
    userId: Types.ObjectId;
    judgement: Map<string, 'like' | 'dislike'>;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;

    // Virtuals
    likesCount: number;
    dislikesCount: number;
    totalJudgement: number;
    latestContent: Content;

    // Methods
    setJudgement(userId: string, judgement: 'like' | 'dislike'): void;
    markAsDeleted(userId: string): void;
}

// model interface
export interface CommentModel extends Model<CommentDocument> {
    deleteManyOwnedByUser(commentIds: string[], userId: string): Promise<CommentDocument[]>;
    findByUser(userId: string): Promise<CommentDocument[]>;
    countByUser(userId: string): Promise<number>;
    commentsJudgedByUser(userId: string): Promise<CommentDocument[]>;
}

const Comment = mongoose.model<CommentDocument, CommentModel>('Comment', CommentSchema);

export default Comment;