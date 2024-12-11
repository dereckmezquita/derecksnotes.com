import { Schema, model, Types } from 'mongoose';

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
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        text: {
            type: String,
            required: true,
            minlength: 1
        },
        originalContent: {
            type: String,
            required: true,
            minlength: 1
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
        }
    },
    { timestamps: true }
);

export const Comment = model<IComment>('Comment', commentSchema);
