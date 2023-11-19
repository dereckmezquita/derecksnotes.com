export {};

declare global {
    interface CommentsBySlugDTO {
        comments: CommentPopUserDTO[];
        hasMore: boolean;
    }

    interface MeDTO {
        user: UserDTO;
        commentsIds: string[];
        commentsLikedIds: string[];
        commentsDislikedIds: string[];
        commentsCount: number;
    }

    interface JudgeDTO {
        id: string;
        judgement: 'like' | 'dislike';
    }
}