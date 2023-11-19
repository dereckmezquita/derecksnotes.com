import { useState } from 'react';
import path from 'path';

import { DEFAULT_PROFILE_IMAGE, MAX_COMMENT_DEPTH, ROOT_PUBLIC } from '@constants/config';
import { FORMAT_DATE_YYYY_MM_DD_HHMMSS } from '@constants/dates';

import CommentForm from './CommentForm';
import LikeDislikeBadge from '@components/atomic/LikeDislikeBadge';

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

import api_delete_comments from '@utils/api/interact/delete_comments';

interface CommentProps {
    commentObj: CommentPopUserDTO;
    currentUserId?: string;
    depth: number;
}

const Comment = ({ commentObj, currentUserId, depth }: CommentProps) => {
    const [comment, setComment] = useState<CommentPopUserDTO>(commentObj);
    const isCurrentUser = currentUserId === comment.userId;

    const profilePhoto: string = comment.user?.latestProfilePhoto
        ? path.join(ROOT_PUBLIC, 'site-images/uploads/profile-photos', comment.user?.latestProfilePhoto)
        : DEFAULT_PROFILE_IMAGE;

    // ---------------------------------------------------
    // toggle show reply button on off
    const [showReplyForm, setShowReplyForm] = useState(false);

    const toggleReplyForm = () => {
        setShowReplyForm(!showReplyForm);
    };

    // ---------------------------------------------------
    // new reply
    const handleNewReply = (newReply: CommentPopUserDTO) => {
        if (comment._id === newReply.parentComment) {
            comment.childComments = [newReply, ...(comment.childComments as CommentPopUserDTO[])];
        }

        // Close the reply form after a successful reply
        setShowReplyForm(false);
    }
    // ---------------------------------------------------
    // delete comment
    const handleDeleteComment = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!isConfirmed) return;

        const response: CommentsBySlugDTO = await api_delete_comments([comment._id!]);
        if (response) {
            setComment(response.comments[0]);
        }
    };

    // ---------------------------------------------------
    // edit comment
    // show edit form
    const [showEditForm, setShowEditForm] = useState(false);

    const toggleEditForm = () => {
        setShowEditForm(!showEditForm);
    };

    const handleEditComment = (editedComment: CommentPopUserDTO) => {
        setComment(editedComment);
        setShowEditForm(false);
    }

    const getCurrentUserJudgement = (): 'like' | 'dislike' | 'neutral' => {
        if (!currentUserId) return 'neutral';
        const userJudgement = comment.judgement[currentUserId];
        return userJudgement || 'neutral';
    }

    return (
        <CommentContainer>
            <CommentHeader>
                <UserProfile>
                    <ProfileImage src={profilePhoto} alt={`${comment.user.username}'s profile`} />
                    <Username currentUser={isCurrentUser}>
                        {comment.user.username} {comment.geolocation.flag}
                    </Username>
                </UserProfile>

                <ActionsContainer>
                    <LikeDislikeBadge
                        initialCount={comment.totalJudgement || 0}
                        commentId={comment._id!}
                        currentUserJudgement={getCurrentUserJudgement()}
                        onJudgementChange={() => { }}
                    />

                    {isCurrentUser && (
                        <>
                            <ActionButton onClick={toggleEditForm}>
                                edit
                            </ActionButton>
                            <ActionButton onClick={handleDeleteComment}>
                                delete
                            </ActionButton>
                        </>
                    )}
                    {depth < MAX_COMMENT_DEPTH && <ActionButton onClick={toggleReplyForm}>reply</ActionButton>}
                </ActionsContainer>
            </CommentHeader>

            {showEditForm ?
                <CommentForm
                    onSubmit={handleEditComment}
                    editComment={comment}
                />
                :
                <CommentText>{comment.latestContent!.comment}</CommentText>
            }

            <DateContainer>
                <CreatedAtDate>{FORMAT_DATE_YYYY_MM_DD_HHMMSS(comment.updatedAt!)}</CreatedAtDate>
                {comment.content.length > 1 &&
                    <UpdatedAtDate>Created: {FORMAT_DATE_YYYY_MM_DD_HHMMSS(comment.content[0].createdAt!)}</UpdatedAtDate>
                }
            </DateContainer>

            {showReplyForm &&
                <CommentForm
                    parentComment={comment._id}
                    onSubmit={handleNewReply}
                />
            }

            {comment.childComments && comment.childComments.length > 0 && (
                <RepliesContainer>
                    {
                        (comment.childComments as CommentPopUserDTO[])
                            .sort((a, b) => {
                                return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
                            })
                            .map((child: CommentPopUserDTO) => (
                                <Comment
                                    key={child._id! + child.latestContent?._id!}
                                    commentObj={child}
                                    currentUserId={currentUserId}
                                    depth={depth + 1}
                                />
                            ))
                    }
                </RepliesContainer>
            )}
        </CommentContainer>
    );
}

export default Comment;