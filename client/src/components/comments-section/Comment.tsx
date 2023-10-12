import {
    CommentContainer,
    CommentHeader,
    UserProfile,
    ProfileImage,
    Username,
    CommentText,
    RepliesContainer,
    ActionsContainer,
    ActionButton,
    DateContainer,
    CreatedAtDate,
    UpdatedAtDate
} from './comment-styled';

interface CommentProps {
    comment: CommentPopUserDTO;
    slug: string;
}

const Comment: React.FC<CommentProps> = ({ comment, slug }) => {
    console.log("Rendering comment with ID: ", comment._id);

    return (
        <p>A comment!</p>
    )
}