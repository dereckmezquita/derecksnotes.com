import mongoose from "mongoose";

const articleMetadataSchema = new mongoose.Schema({
    slug: String,
    commentedBy: [String],
    judgements: [{
        username: String,
        judgement: { type: String, enum: ['like', 'dislike'] }
    }]
});

const ArticleMetadata = mongoose.model<ArticleMetadata>('ArticleMetadata', articleMetadataSchema);
