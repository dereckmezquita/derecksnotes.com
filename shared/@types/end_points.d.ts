export {};

declare global {
    interface CommentsBySlugDTO {
        comments: CommentPopUserDTO[];
        hasMore: boolean;
    }

    interface MeDTO {
        userInfo: UserDTO;
        comments: CommentsBySlugDTO;
        totalComments: number;
        commentsJudged: CommentsBySlugDTO;
    }
}