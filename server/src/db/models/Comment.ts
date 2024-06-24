import mongoose, { Schema, Document, Model } from 'mongoose';
import sanitizeHtml from 'sanitize-html';

export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    post: string; // This will store the slug of the blog post
    parentComment?: mongoose.Types.ObjectId;
    replies: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    originalContent?: string;
    depth: number;
}

export interface ICommentModel extends Model<IComment> {
    findByPostSlug(slug: string): Promise<IComment[]>;
}

const CommentSchema: Schema<IComment> = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 5000 // Adjust as needed
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: String,
        required: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    originalContent: {
        type: String
    },
    depth: {
        type: Number,
        default: 0
    }
});

// Sanitize HTML before saving
CommentSchema.pre<IComment>('save', function (next) {
    if (this.isModified('content')) {
        this.content = sanitizeHtml(this.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt']
            }
        });
    }
    next();
});

// Update the updatedAt field and store original content when content is modified
CommentSchema.pre<IComment>('save', function (next) {
    if (this.isModified('content')) {
        if (!this.originalContent) {
            this.originalContent = this.content;
        }
        this.updatedAt = new Date();
    }
    next();
});

CommentSchema.statics.findByPostSlug = async function (
    slug: string
): Promise<IComment[]> {
    return this.find({ post: slug, parentComment: null })
        .sort('-createdAt')
        .populate('author', 'username profilePhoto')
        .exec();
};

export const Comment: ICommentModel = mongoose.model<IComment, ICommentModel>(
    'Comment',
    CommentSchema
);
