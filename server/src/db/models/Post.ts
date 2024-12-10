// server/src/db/models/Post.ts
import { Schema, model, Types } from 'mongoose';

export interface IPost {
    _id: Types.ObjectId;
    title: string;
    content: string;
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    { timestamps: true }
);

export const Post = model<IPost>('Post', postSchema);
