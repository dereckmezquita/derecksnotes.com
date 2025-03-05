// server/src/db/models/Post.ts
import { Schema, model, Types } from 'mongoose';

export interface IPost {
    _id: Types.ObjectId;
    slug: string;
    title: string;
    views: number;
    likes: number;
    published: boolean;
    comments: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>(
    {
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        published: { type: Boolean, default: false },
        comments: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const Post = model<IPost>('Post', postSchema);
