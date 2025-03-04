import React from 'react';
import { CommentItem } from './CommentItem';
import { CommentListProps } from './types';
import { CommentListContainer, NoCommentsMessage } from './CommentStyles';

export function CommentList({
    comments,
    postSlug,
    currentUser,
    onUpdateComment,
    onAddReply,
    level = 0,
    isProfileView = false,
    onDelete
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
                    isProfileView={isProfileView}
                    onDelete={onDelete}
                />
            ))}
        </CommentListContainer>
    );
}
