import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

const CommentContainer = styled.div`
    position: relative;
    background-color: ${theme.container.background.colour.primary()};
    border: 1px solid ${theme.container.border.colour.primary()};
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CommentHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
`;

const ProfileImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%; // Makes the image circular
    margin-right: 10px; // Spacing between image and username
`;

const Username = styled.span`
    font-weight: bold;
    font-family: ${theme.text.font.times};
    color: hsl(205, 70%, 50%);
`;

const CommentText = styled.p`
    font-family: ${theme.text.font.times};
    font-size: 0.9em;
    margin-bottom: 10px;
`;

const RepliesContainer = styled.div`
    position: relative;
    margin-left: 30px;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: -10px;
        width: 2px;
        height: 100%;
        background-color: ${theme.container.border.colour.primary()};
    }
`;

const ActionsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const ActionButton = styled.button`
    background-color: transparent;
    border: none;
    font-family: ${theme.text.font.times};
    font-size: 0.8em;
    cursor: pointer;
    color: hsl(0, 0%, 70%);
    &:hover {
        color: hsl(205, 70%, 50%);
        text-decoration: underline;
    }
`;

interface User {
    id: string;
    name: string;
    profileImage: string;
}

interface Comment {
    id: string;
    text: string;
    author: User;
    replies: Comment[];
}

interface CommentItemProps {
    comment: Comment;
    currentUserId: string; // ID of the user who's currently logged in
    onReply?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUserId, onReply, onEdit, onDelete }) => {
    const isCurrentUser = currentUserId === comment.author.id;

    return (
        <CommentContainer>
            <CommentHeader>
                <UserProfile>
                    <ProfileImage src={comment.author.profileImage} alt={`${comment.author.name}'s profile`} />
                    <Username>{comment.author.name}</Username>
                </UserProfile>
                <ActionsContainer>
                    <ActionButton onClick={() => onReply && onReply(comment.id)}>reply</ActionButton>
                    {isCurrentUser && (
                        <>
                            <ActionButton onClick={() => onEdit && onEdit(comment.id)}>edit</ActionButton>
                            <ActionButton onClick={() => onDelete && onDelete(comment.id)}>delete</ActionButton>
                        </>
                    )}
                </ActionsContainer>
            </CommentHeader>
            <CommentText>{comment.text}</CommentText>
            <RepliesContainer>
                {comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} currentUserId={currentUserId} onReply={onReply} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </RepliesContainer>
        </CommentContainer>
    );
};

export default CommentItem;