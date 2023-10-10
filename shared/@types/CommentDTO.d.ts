export { };

// CommentDTO, is a data transfer object (DTO)

declare global {
    interface ContentDTO {
        comment: string;
        createdAt?: Date;
        updatedAt?: Date;
        _id?: string;
    }

    interface CommentDTO {
        _id?: string; // added _id because usually when you fetch data from MongoDB, you get the _id field
        childComments: string[] | CommentDTO[] | CommentPopUserDTO[];
        parentComment: string | null | CommentDTO | CommentPopUserDTO;
        reportTarget: string | null | CommentDTO | CommentPopUserDTO;
        mentions: string[];
        slug: string;
        content: ContentDTO[];
        userId: string;
        judgement: Record<string, 'like' | 'dislike'>;
        deleted: boolean;

        createdAt?: Date;
        updatedAt?: Date;

        // Virtuals; optional because they are not always present
        likesCount?: number;
        dislikesCount?: number;
        totalJudgement?: number;
        latestContent?: ContentDTO;
    }

    // CommentPopUserDTO is a CommentDTO with the user populated
    // but only username, profilePhotos and latestProfilePhoto are added from UserDTO
    interface CommentPopUserDTO extends CommentDTO {
        user: {
            _id: string;
            username: string;
            profilePhotos: string[];
            latestProfilePhoto?: string | null;
        }
    }

    // interface CommentPopUserDTO extends CommentDTO {
    //     user: Pick<UserDTO, 'username' | 'profilePhotos' | 'latestProfilePhoto'>;
    // }
}