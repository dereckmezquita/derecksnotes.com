import React, { useEffect, useState } from 'react';
import path from 'path';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import { DEFAULT_PROFILE_IMAGE, ROOT_PUBLIC, MAX_COMMENT_DEPTH } from '@constants/config';
import CommentForm from './CommentForm';
import { FORMAT_DATE_YYYY_MM_DD_HHMMSS } from '@constants/dates';

const CommentContainer = styled.div`
    position: relative;
    background-color: ${theme.container.background.colour.primary()};
    padding: 10px 5px 10px 15px;
    margin-bottom: 15px;
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${theme.container.shadow.box};
    &:hover {
        box-shadow: ${theme.container.shadow.primary};
    }
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
    border-radius: 50%;
    margin-right: 10px;
    border: 1px solid ${theme.container.border.colour.primary()};
`;

const Username = styled.span<{ currentUser: boolean }>`
    font-weight: bold;
    font-family: ${theme.text.font.times};
    color: ${props => props.currentUser ? 'hsl(205, 70%, 50%)' : theme.text.colour.header()};
`;

const CommentText = styled.p`
    font-family: ${theme.text.font.times};
    font-size: 0.9em;
    margin-bottom: 10px;
    overflow: hidden;
`;

const RepliesContainer = styled.div`
    position: relative;
    margin-top: 15px;
    margin-left: 15px;
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

const DateContainer = styled.div`
    position: relative;
    cursor: pointer;
    color: ${theme.text.colour.light_grey()};
`;

const CreatedAtDate = styled.span`
    font-size: 0.7em;
    font-family: ${theme.text.font.times};
`;

const UpdatedAtDate = styled.span`
    font-size: 0.8em;
    font-family: ${theme.text.font.times};
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    background-color: #fff; // Background color to ensure text readability
    border: 1px solid ${theme.container.border.colour.primary()};
    padding: 2px 5px;
    border-radius: 4px;
    z-index: 10;
    
    ${DateContainer}:hover & {
        opacity: 1;
    }
`;

interface CommentProps {
    comment: CommentPopUserDTO;
    slug: string; // used for the CommentForm replies
    depth: number;
    onReply?: (id: any) => void;
    onEdit?: (id: string) => void;
    onDelete: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, slug, onReply, onEdit, onDelete, depth }) => {
    console.log("Rendering comment with ID:", comment._id);

    // ---------------------------------------------------
    // if user id of comment matches current viewer (session) then allow edit and delete buttons
    const userData = useSelector((state: RootState) => state.user);

    const currentUserId: string | undefined = userData?.data?.userInfo?._id;
    const isCurrentUser = currentUserId === comment.userId;

    const profilePhoto: string = comment.user?.latestProfilePhoto
        ? path.join(ROOT_PUBLIC, 'site-images/uploads/profile-photos', comment.user?.latestProfilePhoto)
        : DEFAULT_PROFILE_IMAGE;


    // // ---------------------------------------------------
    // toggle show reply button on off
    const [showReplyForm, setShowReplyForm] = useState(false);

    const toggleReplyForm = () => {
        setShowReplyForm(!showReplyForm);
    };

    const handleDeleteComment = async (commentId: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!isConfirmed) return;

        onDelete(commentId);
    };

    const [, forceUpdate] = useState({});

    return (
        <CommentContainer key={comment._id + comment.latestContent!._id!}>
            <CommentHeader>
                <UserProfile>
                    <ProfileImage src={profilePhoto} alt={`${comment.user.username}'s profile`} />
                    <Username currentUser={isCurrentUser}>{comment.user.username}</Username>
                </UserProfile>
                <ActionsContainer>
                    {isCurrentUser && (<>
                        <ActionButton onClick={() => onEdit && onEdit(comment._id!)}>
                            edit
                        </ActionButton>
                        <ActionButton onClick={() => handleDeleteComment(comment._id!)}>
                            delete
                        </ActionButton>
                    </>)}
                    {depth < MAX_COMMENT_DEPTH && <ActionButton onClick={toggleReplyForm}>reply</ActionButton>}
                </ActionsContainer>
            </CommentHeader>
            <CommentText>{comment.latestContent!.comment}</CommentText>
            <DateContainer>
                <CreatedAtDate>{FORMAT_DATE_YYYY_MM_DD_HHMMSS(comment.updatedAt!)}</CreatedAtDate>
                {comment.content.length > 1 &&
                    <UpdatedAtDate>Created: {FORMAT_DATE_YYYY_MM_DD_HHMMSS(comment.content[0].createdAt!)}</UpdatedAtDate>
                }
            </DateContainer>
            {showReplyForm &&
                <CommentForm
                    slug={slug}
                    parentComment={comment._id}
                    onSubmit={(newReply) => {
                        // Existing logic
                        if (comment._id === newReply.parentComment) {
                            comment.childComments = [...(comment.childComments as CommentPopUserDTO[]), newReply];
                            // Trigger re-render
                            forceUpdate({});
                        } else if (onReply) { // Otherwise, propagate the new reply to parent Comment
                            onReply(newReply);
                        }

                        // Close the reply form after a successful reply
                        setShowReplyForm(false);
                    }}
                />
            }
            {comment.childComments && comment.childComments.length > 0 && (
                <RepliesContainer>
                    {(comment.childComments as CommentPopUserDTO[]).map((child: CommentPopUserDTO) => (
                        <Comment
                            key={child._id! + child.latestContent?._id!}
                            comment={child}
                            slug={slug}
                            depth={depth + 1}
                            onReply={onReply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </RepliesContainer>
            )}
        </CommentContainer>
    );
};


/**
NOTE:
 * Wraps the Comment component with React.memo to optimize rendering.
 * The component only re-renders if the comment's `_id` or its `latestContent`'s `_id` changes.
 * This ensures unnecessary renders are avoided, especially when parent state changes.
**/
export default React.memo(Comment, (prevProps, nextProps) => {
    return prevProps.comment._id === nextProps.comment._id &&
        prevProps.comment!.latestContent!._id === nextProps.comment!.latestContent!._id;
});