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
CommentSchema.statics.findByPostSlug = async function (
    slug: string,
    options: {
        page?: number;
        limit?: number;
        depth?: number;
    } = {}
): Promise<{ comments: IComment[]; total: number }> {
    const { page = 1, limit = 10, depth = 3 } = options;
    const skip = (page - 1) * limit;

    const populateAuthor = {
        $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'authorInfo'
        }
    } as PipelineStage;

    const unwindAuthor = {
        $unwind: '$authorInfo'
    } as PipelineStage;

    const projectAuthor = {
        $project: {
            'author._id': '$authorInfo._id',
            'author.username': '$authorInfo.username',
            'author.profilePhoto': '$authorInfo.profilePhoto',
            'author.role': '$authorInfo.role',
            'author.createdAt': '$authorInfo.createdAt',
            content: 1,
            post: 1,
            parentComment: 1,
            replies: 1,
            likes: 1,
            dislikes: 1,
            createdAt: 1,
            updatedAt: 1,
            originalContent: 1,
            depth: 1
        }
    } as PipelineStage;

    const recursiveLookup = (currentDepth: number): PipelineStage[] => {
        if (currentDepth <= 0) {
            return [
                {
                    $project: {
                        replies: 0
                    }
                } as PipelineStage
            ];
        }

        return [
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'parentComment',
                    as: 'replies',
                    pipeline: [
                        populateAuthor,
                        unwindAuthor,
                        projectAuthor,
                        ...recursiveLookup(currentDepth - 1)
                    ]
                }
            } as PipelineStage
        ];
    };

    const pipeline: PipelineStage[] = [
        { $match: { post: slug, parentComment: null } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        populateAuthor,
        unwindAuthor,
        projectAuthor,
        ...recursiveLookup(depth)
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
