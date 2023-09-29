import React, { useEffect, useState } from 'react';
import path from 'path';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import api_get_comments_by_array_of_ids from '@utils/api/interact/get_comments_by_array_of_ids';
import { DEFAULT_PROFILE_IMAGE, ROOT_PUBLIC } from '@constants/config';

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

interface CommentProps {
    comment: CommentInfo;
    currentUserId: string;
    onReply?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, currentUserId, onReply, onEdit, onDelete }) => {
    // this component receives a comment to render and the current user that is viewing the page's id
    // if they match then the user can edit or delete the comment
    // otherwise they can only reply to the comment
    const isCurrentUser = currentUserId === comment.userId;
    const [replies, setReplies] = useState<CommentInfoResponse | null>(null);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                setReplies(await api_get_comments_by_array_of_ids(comment.childComments));
            } catch (error) {
                console.error('Failed to fetch replies:', error);
            }
        }

        fetchReplies();
    }, [comment.userId]); // Run the effect when comment.userId changes

    if (!replies) return null;

    const profilePhoto: string = comment.latestProfilePhoto ?
        path.join(ROOT_PUBLIC, 'site-images/uploads/profile-photos', comment.latestProfilePhoto) :
        DEFAULT_PROFILE_IMAGE;

    return (
        <CommentContainer key={comment._id}>
            <CommentHeader>
                <UserProfile>
                    <ProfileImage src={profilePhoto} alt={`${comment.username}'s profile`} />
                    <Username>{comment.username}</Username>
                </UserProfile>
                <ActionsContainer>
                    <ActionButton onClick={() => onReply && onReply(comment._id)}>reply</ActionButton>
                    {isCurrentUser && (
                        <>
                            <ActionButton onClick={() => onEdit && onEdit(comment._id)}>edit</ActionButton>
                            <ActionButton onClick={() => onDelete && onDelete(comment._id)}>delete</ActionButton>
                        </>
                    )}
                </ActionsContainer>
            </CommentHeader>
            <CommentText>{comment.latestContent.comment}</CommentText>
            <RepliesContainer>
                {replies.comments.map((reply: CommentInfo) => (
                    <Comment key={reply._id} comment={reply} currentUserId={currentUserId} onReply={onReply} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </RepliesContainer>
        </CommentContainer>
    );
};

export default Comment;