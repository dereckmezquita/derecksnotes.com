export { };

declare global {
    interface CommentInfo2 {
        childComments: string[]; // _id of the child comments
        parentComment: string; // _id of the parent comment
        reportTarget?: string; // _id of a comment this one is reporting
        mentions?: string[]; // _id of the users mentioned in this comment
        slug: string; // slugs must be unique
        content: {
            comment: string;
            createdAt: Date; // added by mongoose
            updatedAt: Date;
        }[];
        userId: string; // _id of the user
        // judgement is now a map
        judgement: {
            [userId: string]: 'like' | 'dislike';
        };
        deleted: boolean;
    }
}