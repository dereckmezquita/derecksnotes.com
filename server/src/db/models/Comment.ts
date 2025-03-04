import { Schema, model, Types } from 'mongoose';
import { MAX_COMMENT_LENGTH } from '../../utils/constants';

// Interface for revision history
export interface ICommentRevision {
    text: string;
    timestamp: Date;
}

export interface IComment {
    _id: Types.ObjectId;
    text: string;
    originalContent: string;
    author: Types.ObjectId;
    post: Types.ObjectId;
    parentComment?: Types.ObjectId | null;
    likes: Types.ObjectId[];
    dislikes: Types.ObjectId[];
    deleted: boolean;
    revisions: ICommentRevision[];
    lastEditedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Schema for revision history
const CommentRevisionSchema = new Schema<ICommentRevision>({
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const commentSchema = new Schema<IComment>(
    {
        text: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: MAX_COMMENT_LENGTH
        },
        originalContent: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: MAX_COMMENT_LENGTH
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null
        },
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
        deleted: {
            type: Boolean,
            default: false
        },
        revisions: [CommentRevisionSchema],
        lastEditedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

// Indexes for faster querying
commentSchema.index({ post: 1, parentComment: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

export const Comment = model<IComment>('Comment', commentSchema);
