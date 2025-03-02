import React from 'react';
import styled from 'styled-components';
import { CommentItem } from './CommentItem';
import { CommentType } from './Comments';
import { User } from '@context/AuthContext';

interface CommentListProps {
    comments: CommentType[];
    postSlug: string;
    currentUser: User | null;
    onUpdateComment: (
        commentId: string,
        updateFn: (comment: CommentType) => CommentType
    ) => void;
    onAddReply: (parentId: string, newReply: CommentType) => void;
    level?: number;
}

const CommentListContainer = styled.div<{ level?: number }>`
    margin-top: ${(props) => (props.level === 0 ? '20px' : '10px')};
    position: relative;
`;

const NoCommentsMessage = styled.p`
    font-style: italic;
    color: ${(props) => props.theme.text.colour.light_grey()};
    text-align: center;
    margin: 20px 0;
`;

export function CommentList({
    comments,
    postSlug,
    currentUser,
    onUpdateComment,
    onAddReply,
    level = 0
}: CommentListProps) {
    if (comments.length === 0 && level === 0) {
        return (
            <NoCommentsMessage>
                No comments yet. Be the first to comment!
            </NoCommentsMessage>
        );
    }

    return (
        <CommentListContainer level={level}>
            {comments.map((comment) => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    postSlug={postSlug}
                    currentUser={currentUser}
                    level={level}
                    onUpdateComment={onUpdateComment}
                    onAddReply={onAddReply}
                />
            ))}
        </CommentListContainer>
    );
}
