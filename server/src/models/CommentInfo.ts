import mongoose from "mongoose";

const commentInfoSchema = new mongoose.Schema({
    commentId: String, // do not use; use _id instead from mongo this is created by mongo by default and is unique
    repliesToThis: { type: [String], default: [] },
    repliesToThat: { type: String, default: null },
    reportsToThat: { type: String, default: null }, // should be _id of the comment
    mentions: { type: [String], default: [] },
    slug: { type: String, required: true },
    comment: { type: String, required: true },
    username: { type: String, required: true },
    datetime: { type: Date, required: true },
    judgement: {
        type: [{
            username: {
                type: String,
                required: true
            },
            judgement: { type: String, enum: ['like', 'dislike'] }
        }],
        default: []
    }
});

const CommentInfo = mongoose.model<CommentInfo>('Comment', commentInfoSchema);

export default CommentInfo;