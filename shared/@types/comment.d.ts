import { Document } from 'mongoose';

export { };

declare global {
    interface CommentInfo extends Document {
        _id: string; // mongodb _id
        childComments: string[] | CommentInfo[];
        parentComment: string | null;
        reportTarget?: string | null;
        mentions?: string[]; // _id of the users mentioned in this comment
        slug: string; // slugs must be unique
        content: {
            _id?: string; // mongodb _id
            comment: string;
            createdAt: Date; // added by mongoose
            updatedAt: Date;
        }[];
        userId: string; // _id of the user
        judgement: {
            [userId: string]: 'like' | 'dislike';
        };
        deleted: boolean;
        // virtuals
        likesCount?: number;
        dislikesCount?: number;
        totalJudgements: number; // likesCount - dislikesCount
        latestContent: {
            comment: string;
            _id?: string; // mongodb _id
            createdAt: Date;
            updatedAt: Date;
        },
        createdAt: Date;
        updatedAt: Date;
        // added during api response
        username?: string;
        latestProfilePhoto?: string;
    }

    interface CommentInfoResponse {
        comments: CommentInfo[];
        hasMore: boolean;
    }
}