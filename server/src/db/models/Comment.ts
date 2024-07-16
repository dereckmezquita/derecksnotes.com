import mongoose, {
    Schema,
    Document,
    Model,
    type PipelineStage
} from 'mongoose';
import sanitizeHtml from 'sanitize-html';

export interface IComment extends Document {
    content: string;
    author: {
        _id: mongoose.Types.ObjectId;
        username: string;
        profilePhoto: string;
        createdAt: Date; // member since
        role: 'user' | 'admin';
    };
    post: string;
    parentComment?: mongoose.Types.ObjectId;
    replies: IComment[]; // Changed from mongoose.Types.ObjectId[] to IComment[]
    likes: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    originalContent?: string;
    depth: number;
}

export interface ICommentModel extends Model<IComment> {
    findByPostSlug(
        slug: string,
        options: {
            page?: number;
            limit?: number;
            depth?: number;
        }
    ): Promise<{ comments: IComment[]; total: number }>;
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

// Sanitise HTML before saving
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
    slug: string,
    options: {
        page?: number;
        limit?: number;
        depth?: number;
    } = {}
): Promise<{ comments: IComment[]; total: number }> {
    const { page = 1, limit = 10, depth = 1 } = options;
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
        { $match: { post: slug, parentComment: null } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $graphLookup: {
                from: 'comments',
                startWith: '$_id',
                connectFromField: '_id',
                connectToField: 'parentComment',
                as: 'replies',
                maxDepth: depth - 1,
                depthField: 'depth'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
            }
        },
        { $unwind: '$author' },
        {
            $project: {
                // 'author._id': 1,
                'author.firstName': 0,
                'author.lastName': 0,
                // 'author.username': 1,
                'author.email': 0,
                'author.password': 0,
                'author.isVerified': 0,
                // 'author.profilePhoto': 1,
                // 'author.createdAt': 1,
                'author.apiKey': 0,
                'author.tempToken': 0,
                'author.tempTokenExpires': 0,
                'author.resetPasswordToken': 0,
                'author.resetPasswordExpires': 0
                // 'author.role': 1
                // ... other fields you want to exclude
            }
        }
    ];

    const comments = await this.aggregate(pipeline).exec();
    const total = await this.countDocuments({
        post: slug,
        parentComment: null
    });

    return { comments, total };
};

export const Comment: ICommentModel = mongoose.model<IComment, ICommentModel>(
    'Comment',
    CommentSchema
);
