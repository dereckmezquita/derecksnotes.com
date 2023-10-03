I have this code. I want it to load comments for a slug with some parameters recursively. However I want for it to also load virtuals for those comments. I tried this but it's not working. I'm getting the commetns and I'm having child comments loaded recursively but we're not getting any user information populated.

We indeed have data as required in the database I already checked.

Please help I'm learning I am a student. Teach me and correct my code. Use my code as a starting point:

```ts
import express from 'express';
import User from '@models/User';
import Comment, { CommentDocument } from '@models/Comment';

const get_article_comments = express.Router();

get_article_comments.get('/get_article_comments/:slug', async (req, res) => {
    const { slug } = req.params;
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
        const comments = await getCommentsWithChildren(slug, limit, skip, dateFilter, depth);

        console.log(
`\x1b[31m------------------ Final result object ------------------
${JSON.stringify(comments)}\x1b[0m`,
        )

        const message: CommentInfoResponse = {
            comments: comments as any,
            total: comments.length,  // Not total including child comments, but top-level comments
            hasMore: false,
        }

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default get_article_comments;

function buildPopulateObject(depth: number): any {
    if (depth <= 0) {
        return null;
    }

    let populateChildren = buildPopulateObject(depth - 1);

    let result = {
        path: 'childComments',
        populate: [
            {
                path: 'user',
                model: 'User'
            }
        ]
    };

    if (populateChildren) {
        result.populate.push(populateChildren);
    }

    return result;
}

async function getCommentsWithChildren(
    slug: string,
    limit: number,
    skip: number,
    dateFilter: {},
    maxDepth: number
): Promise<CommentDocument[]> {
    let populateObj = buildPopulateObject(maxDepth);

    let topLevelComments = await Comment.find<CommentDocument>({
        slug: slug,
        parentComment: null,
        ...dateFilter
    })
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'user',
            model: 'User'
        })
        .populate(populateObj)
        .exec();

    return topLevelComments;
}
```

For your information this is what the result of the populateObj function looks like at the moment:

```json
{"path":"childComments","populate":[{"path":"user","model":"User"},{"path":"childComments","populate":[{"path":"user","model":"User"},{"path":"childComments","populate":[{"path":"user","model":"User"},{"path":"childComments","populate":[{"path":"user","model":"User"},{"path":"childComments","populate":[{"path":"user","model":"User"},{"path":"childComments","populate":[{"path":"user","model":"User"},{"path":"childComments","populate":[{"path":"user","model":"User"},{"path":"childComments","populate":[{"path":"user","model":"User"},{"path":"childComments","populate":[{"path":"user","model":"User"},{"path":"childComments","populate":[{"path":"user","model":"User"}]}]}]}]}]}]}]}]}]}]}
```

As you can see it's generating the correct object for loading child comments that is working. However user information is not loading. What should the object look like if we wanted to populate user information as well?

Here are the schemas for context:

```ts
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


CommentSchema.methods.setJudgement = function (userId: string, judgement: 'like' | 'dislike') {
    this.judgement.set(userId, judgement);
}

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
```
```ts
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: {
        first: { type: String, default: null },
        last: { type: String, default: null }
    },
    profilePhotos: [{
        type: String,
        default: []
    }],
    email: {
        address: {
            type: String,
            unique: true,
            required: true,
            validate: {
                validator: function (v: string) {
                    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v);
                },
                message: (props: any) => `${props.value} is not a valid email!`
            }
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 25,
        validate: {
            validator: function (v: string) {
                const reserved: string[] = ['dereck2']
                return !reserved.includes(v.toLowerCase());
            },
            message: (props: any) => `${props.value} is a reserved username!`
        }
    },
    password: { type: String, required: true },
    metadata: {
        geoLocations: [
            {
                ip: String,
                country: String,
                countryCode: String,
                flag: String,
                regionName: String,
                city: String,
                isp: String,
                org: String,
                firstUsed: Date,
                lastUsed: Date
            }
        ],
        lastConnected: { type: Date, default: new Date() },
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    if (this.isModified('password') && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

// lowercase the username before saving
UserSchema.pre('save', function (next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }

    next();
});

UserSchema.virtual('latestProfilePhoto').get(function () {
    return this.profilePhotos.length > 0 ? this.profilePhotos[this.profilePhotos.length - 1] : null;
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

// ---------------------------------------
// document interface
export interface UserDocument extends Document {
    name: {
        first: string | null;
        last: string | null;
    };
    profilePhotos: string[];
    email: {
        address: string;
        verified: boolean;
    };
    username: string;
    password: string;
    metadata: {
        geoLocations: {
            ip: string;
            country: string;
            countryCode: string;
            flag: string;
            regionName: string;
            city: string;
            isp: string;
            org: string;
            firstUsed: Date;
            lastUsed: Date;
        }[];
        lastConnected: Date;
    };

    // Virtuals
    latestProfilePhoto: string | null;

    // Methods
    isPasswordCorrect(password: string): Promise<boolean>;
}

// User Model Interface
export interface UserModel extends Model<UserDocument> {
    // You can add static methods here if needed in the future.
}

const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export default User;
```