import mongoose, { Document, Model } from "mongoose";

const ArticleSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    judgement: {
        type: Map,
        of: {
            type: String,
            enum: ['like', 'dislike'],
            required: true
        },
        default: {}
    },
    commentCount: {
        type: Number,
        default: 0
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
ArticleSchema.methods.setJudgement = function (userId: string, judgement: 'like' | 'dislike') {
    this.judgements.set(userId, judgement);
};

// ---------------------------------------
// virtuals
// ---------------------------------------
/*
const comment = await CommentInfo.findById(someId);
console.log(comment.likesCount);
*/
ArticleSchema.virtual('likesCount').get(function (this: ArticleDocument) {
    let count = 0;
    for (let [, judgement] of this.judgement) {
        if (judgement === 'like') count++;
    }
    return count;
});

ArticleSchema.virtual('dislikesCount').get(function (this: ArticleDocument) {
    let count = 0;
    for (let [, judgement] of this.judgement) {
        if (judgement === 'dislike') count++;
    }
    return count;
});

// need to add virtuals to the interface
ArticleSchema.virtual('totalJudgement').get(function (this: ArticleDocument) {
    return this.likesCount - this.dislikesCount;
});

// ---- static methods ----
/*
get articles judged by a user
const articlesJudged = await ArticleMetadata.findByUser(someUserId);
*/
ArticleSchema.statics.findByUser = function (userId: string) {
    return this.find({ [`judgements.${userId}`]: { $exists: true } });
};

// get number of comments per article by slug
ArticleSchema.statics.getCommentCountBySlug = async function(slug: string): Promise<number> {
    const article = await this.findOne({ slug });
    if (!article) {
        throw new Error("Article not found.");
    }
    return article.commentCount;
};

// ---------------------------------------
// interfaces
// ---------------------------------------
// Article Document Interface
export interface ArticleDocument extends Document {
    slug: string;
    judgement: Map<string, 'like' | 'dislike'>;
    commentCount: number;

    // Instance methods
    setJudgement(userId: string, judgement: 'like' | 'dislike'): void;

    // Virtuals
    likesCount: number;
    dislikesCount: number;
    totalJudgement: number;
}

// Article Model Interface
export interface ArticleModel extends Model<ArticleDocument> {
    findByUser(userId: string): Promise<ArticleDocument[]>;
}

export const Article = mongoose.model<ArticleDocument, ArticleModel>('Article', ArticleSchema);

export default Article;