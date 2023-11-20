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
*/
/**
 * Set the judgement of a user on an article by atomic update; does require doc.save()
 * 
 * @param this ArticleDocument
 * @param userId Mongo ObjectId of the user
 * @param judgement 'like' or 'dislike'
 * @returns updated ArticleDocument
 */
ArticleSchema.methods.setJudgement = async function(this: ArticleDocument, userId: string, judgement: 'like' | 'dislike'): Promise<ArticleDocument> {
    const currentJudgement = this.judgement.get(userId);

    // Check if the current judgement is the same as the new judgement
    if (currentJudgement === judgement) {
        // Remove the judgement
        this.judgement.delete(userId);
        await Article.updateOne(
            { _id: this._id },
            { $unset: { [`judgement.${userId}`]: "" } }
        );
    } else {
        // Set the new judgement
        this.judgement.set(userId, judgement);
        await Article.updateOne(
            { _id: this._id },
            { $set: { [`judgement.${userId}`]: judgement } }
        );
    }

    // Optionally, reload the article document to reflect the new state
    const updatedArticle = await Article.findById(this._id).exec();
    return updatedArticle!;
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
    setJudgement(userId: string, judgement: 'like' | 'dislike'): Promise<ArticleDocument>;

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