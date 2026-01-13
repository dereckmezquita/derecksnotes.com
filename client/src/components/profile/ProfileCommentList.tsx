import React from 'react';
import { User } from '@context/AuthContext';
import { CommentType } from '@components/comments/types';
import { ProfileCommentItem } from './ProfileCommentItem';
import {
    NoCommentsMessage,
    CommentListContainer
} from '@components/comments/CommentStyles';

interface ProfileCommentListProps {
    comments: CommentType[];
    currentUser: User | null;
    selectedComments: string[];
    toggleSelectComment: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
    onReactionUpdate?: (
        commentId: string,
        newReaction: 'like' | 'dislike' | null
    ) => void;
    Checkbox: React.ComponentType<{
        checked: boolean;
        onChange: () => void;
    }>;
}

export const ProfileCommentList: React.FC<ProfileCommentListProps> = ({
    comments,
    currentUser,
    selectedComments,
    toggleSelectComment,
    onDelete,
    onReactionUpdate,
    Checkbox
}) => {
    if (comments.length === 0) {
        return (
            <NoCommentsMessage>
                <p>No comments found</p>
                <span>Your comments will appear here</span>
            </NoCommentsMessage>
        );
    }

    return (
        <CommentListContainer level={0}>
            {comments.map((comment) => (
                <ProfileCommentItem
                    key={comment.id}
                    comment={comment}
                    currentUser={currentUser}
                    selected={selectedComments.includes(comment.id)}
                    toggleSelect={toggleSelectComment}
                    onDelete={onDelete}
                    onReactionUpdate={onReactionUpdate}
                    Checkbox={Checkbox}
                />
            ))}
        </CommentListContainer>
    );
};
