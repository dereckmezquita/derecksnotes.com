import mongoose from "mongoose";

const articleMetadataSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
    },
    judgements: {
        type: Map,
        of: {
            type: String,
            enum: ['like', 'dislike'],
            required: true
        },
        default: {}
    }
});

// ---------------------------------------
// methods
// ---------------------------------------
// ---- instance methods ----
/*
const article = await ArticleMetadata.findOne({ slug: 'some-slug' });
article.setJudgement(someUserId, 'like');
await article.save();
*/
articleMetadataSchema.methods.setJudgement = function (userId: string, judgement: 'like' | 'dislike') {
    this.judgements.set(userId, judgement);
};

// ---- static methods ----
/*
get articles judged by a user
const articlesJudged = await ArticleMetadata.findByUser(someUserId);
*/
articleMetadataSchema.statics.findByUser = function (userId: string) {
    return this.find({ [`judgements.${userId}`]: { $exists: true } });
};

const ArticleMetadata = mongoose.model<ArticleMetadata>('ArticleMetadata', articleMetadataSchema);

export default ArticleMetadata;