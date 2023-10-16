I'm looking to find the most efficient and performant implementation.

So this is the code currently. And I provide you the data it returned below. As you can see we are getting what we want for parent comments child comments loaded and username and latest profile picture added which is great. But this is not being done for the child comments.

I want every comment to be loaded and have their child comments be loaded and add username and latest profile photo for each one recursively. How can we best do this, in the most efficient method using mongoose?

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

        const depth: number = 5;
        const comments = await CommentInfo.aggregate([
            {
                $match: { slug: slug, parentComment: null }
            },
            {
                $graphLookup: {
                    from: 'comments',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parentComment',
                    as: 'childComments',
                    depthField: 'depth',
                    maxDepth: depth - 1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $addFields: {
                    "username": "$user.username",
                    "latestProfilePhoto": { $arrayElemAt: [ "$user.profilePhotos", -1 ] }
                }
            },
            {
                $project: { user: 0 } // remove the user object as it's not required
            }
        ]);
        

        console.log(comments);

        const message: CommentInfoResponse = {
            comments: comments,
            total: 0,
            hasMore: false
        }

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default get_article_comments;
```

```json
{
    "comments": [
        {
            "_id": "6518ddcab816a4e1340b3178",
            "childComments": [
                {
                    "_id": "6518efba8712a073c0413eaa",
                    "childComments": [
                        "65190461ee9f01f6c828770e"
                    ],
                    "parentComment": "6518ddcab816a4e1340b3178",
                    "reportTarget": null,
                    "mentions": [],
                    "slug": "chemistry_general-chemistry_a_acid",
                    "content": [
                        {
                            "comment": "ddd",
                            "_id": "6518efba8712a073c0413eab",
                            "createdAt": "2023-10-01T04:04:10.167Z",
                            "updatedAt": "2023-10-01T04:04:10.167Z"
                        }
                    ],
                    "userId": "65150eaf09acd7d63838949b",
                    "judgement": {},
                    "deleted": false,
                    "createdAt": "2023-10-01T04:04:10.167Z",
                    "updatedAt": "2023-10-01T05:32:17.666Z",
                    "__v": 1,
                    "depth": 0
                },
                {
                    "_id": "65190461ee9f01f6c828770e",
                    "childComments": [],
                    "parentComment": "6518efba8712a073c0413eaa",
                    "reportTarget": null,
                    "mentions": [],
                    "slug": "chemistry_general-chemistry_a_acid",
                    "content": [
                        {
                            "comment": "eee",
                            "_id": "65190461ee9f01f6c828770f",
                            "createdAt": "2023-10-01T05:32:17.673Z",
                            "updatedAt": "2023-10-01T05:32:17.673Z"
                        }
                    ],
                    "userId": "65150eaf09acd7d63838949b",
                    "judgement": {},
                    "deleted": false,
                    "createdAt": "2023-10-01T05:32:17.674Z",
                    "updatedAt": "2023-10-01T05:32:17.674Z",
                    "__v": 0,
                    "depth": 1
                }
            ],
            "parentComment": null,
            "reportTarget": null,
            "mentions": [],
            "slug": "chemistry_general-chemistry_a_acid",
            "content": [
                {
                    "comment": "ccc",
                    "_id": "6518ddcab816a4e1340b3179",
                    "createdAt": "2023-10-01T02:47:38.349Z",
                    "updatedAt": "2023-10-01T02:47:38.349Z"
                }
            ],
            "userId": "65150eaf09acd7d63838949b",
            "judgement": {},
            "deleted": false,
            "createdAt": "2023-10-01T02:47:38.349Z",
            "updatedAt": "2023-10-01T04:04:10.162Z",
            "__v": 1,
            "username": "dereck",
            "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg"
        }
    ],
    "total": 0,
    "hasMore": false
}
```

Here are the relevant schemas:

```ts
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        first: { type: String, default: null },
        last: { type: String, default: null }
    },
    profilePhotos: {
        type: [String],
        default: []
    },
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

userSchema.pre('save', async function (next) {
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
userSchema.pre('save', function (next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }

    next();
});

userSchema.virtual('latestProfilePhoto').get(function () {
    return this.profilePhotos.length > 0 ? this.profilePhotos[this.profilePhotos.length - 1] : null;
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<UserInfo & mongoose.Document>('User', userSchema);

export default User;
```

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
    childComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
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

commentInfoSchema.virtual('latestContent').get(function () {
    return this.content[this.content.length - 1];
});

commentInfoSchema.methods.setJudgement = function (userId: string, judgement: 'like' | 'dislike') {
    this.judgement.set(userId, judgement);
}

commentInfoSchema.methods.markAsDeleted = function(this: CommentInfoDocument, userId: string) {
    if (this.userId.toString() !== userId) {
        throw new Error("You do not own this comment.");
    }

    console.log('Mongo: ', this.content[this.content.length - 1].comment);
    console.log('Mongo: ', this.content[this.content.length - 1].comment === "[deleted]")

    if (this.content[this.content.length - 1].comment === "[deleted]") {
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

    return await Promise.all(promises);
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
    deleteManyOwnedByUser: (commentIds: string[], userId: string) => Promise<CommentInfoDocument[]>;
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