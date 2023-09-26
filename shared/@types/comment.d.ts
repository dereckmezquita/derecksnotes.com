export { };

declare global {
    interface CommentInfo {
        commentId: string;
        repliesToThis: string[]; // array of commentIds
        repliesToThat?: string; // comment itself is a reply
        reportsToThat?: string; // comment itself is a report
        mentions?: string[]; // array of usernames
        slug: string;
        comment: string[]; // idx 0 orignal comment; any after are edits
        username: string;
        datetime: Date;
        judgements: {
            username: string;
            judgement: 'like' | 'dislike';
        }[];
    }
}