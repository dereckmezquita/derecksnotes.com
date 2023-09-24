import mongoose from "mongoose";

const commentInfoSchema = new mongoose.Schema({
    commentId: String,
    repliesToThis: [String],
    repliesToThat: String,
    reportsToThat: String,
    mentions: [String],
    slug: String,
    comment: [String],
    username: String,
    datetime: Date,
    judgement: [{
        username: String,
        judgement: { type: String, enum: ['like', 'dislike'] }
    }]
});

const CommentInfo = mongoose.model<CommentInfo>('Comment', commentInfoSchema);
