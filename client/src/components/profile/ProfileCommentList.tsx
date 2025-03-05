import React from 'react';
import { User } from '@context/AuthContext';
import { CommentType } from '@components/comments/types';
import { ProfileCommentItem } from './ProfileCommentItem';
import styled from 'styled-components';

interface ProfileCommentListProps {
    comments: CommentType[];
    currentUser: User | null;
    selectedComments: string[];
    toggleSelectComment: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
    Checkbox: React.ComponentType<{
        checked: boolean;
        onChange: () => void;
    }>;
}

const EmptyMessage = styled.div`
    text-align: center;
    padding: 40px 20px;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

export const ProfileCommentList: React.FC<ProfileCommentListProps> = ({
    comments,
    currentUser,
    selectedComments,
    toggleSelectComment,
    onDelete,
    Checkbox
}) => {
    if (comments.length === 0) {
        return <EmptyMessage>No comments found.</EmptyMessage>;
    }

    return (
        <div>
            {comments.map((comment) => (
                <ProfileCommentItem
                    key={comment._id}
                    comment={comment}
                    currentUser={currentUser}
                    selected={selectedComments.includes(comment._id)}
                    toggleSelect={toggleSelectComment}
                    onDelete={onDelete}
                    Checkbox={Checkbox}
                />
            ))}
        </div>
    );
};
