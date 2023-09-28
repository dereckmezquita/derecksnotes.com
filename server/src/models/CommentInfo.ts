import { ObjectId } from "mongodb";
import mongoose from "mongoose";

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
    reportsToThat: { // only added if the comment itself is a report of another comment
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
    judgement: { // likes/dislikes by users
        type: [{
            userId: {
                type: ObjectId, // _id of the user
                required: true,
                ref: 'User',
            },
            judgement: {
                type: String,
                enum: ['like', 'dislike'],
                required: true,
            }
        }],
        default: []
    },
});

// ---------------------------------------
// pre save hooks
// ---------------------------------------
// trim the comment before saving
commentInfoSchema.pre('save', function (next) {
    const comment = this;
    const lastCommentIndex = comment.content.length - 1;

    if (comment.content[lastCommentIndex]) {
        comment.content[lastCommentIndex].content = comment.content[lastCommentIndex].content.trim();
    }

    next();
});

// ---------------------------------------
// virtuals
// ---------------------------------------
commentInfoSchema.virtual('likesCount').get(function() {
    return this.judgement.filter(j => j.judgement === 'like').length;
});

commentInfoSchema.virtual('dislikesCount').get(function() {
    return this.judgement.filter(j => j.judgement === 'dislike').length;
});

// need to add virtuals to the interface
commentInfoSchema.virtual('totalJudgement').get(function(this: CommentInfoDocument) {
    return this.likesCount - this.dislikesCount;
});

// ---------------------------------------
// methods
// ---------------------------------------
/*
const comment = await CommentInfo.findById(someId);
const latest = comment.latestContent();
*/
commentInfoSchema.methods.latestContent = function() {
    return this.content[this.content.length - 1];
};

/* const userComments = await CommentInfo.findByUser(someUserId); */
commentInfoSchema.statics.findByUser = function(userId) {
    return this.find({ userId });
};


// ---------------------------------------
// interface for adding virtuals and methods
interface CommentInfoDocument extends mongoose.Document {
    likesCount: number;
    dislikesCount: number;
    totalJudgement: number;
    // ... any other methods or virtuals you add
}

const CommentInfo = mongoose.model<CommentInfoDocument>('Comment', commentInfoSchema);

export default CommentInfo;