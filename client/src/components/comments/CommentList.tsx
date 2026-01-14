import React from 'react';
import { MAX_COMMENT_DEPTH } from '@lib/constants';
import { CommentItem } from './CommentItem';
import { CommentListProps } from './types';
import { CommentListContainer, NoCommentsMessage } from './CommentStyles';

export function CommentList({
    comments,
    slug,
    title,
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
                <p>No comments yet</p>
                <span>Be the first to share your thoughts!</span>
            </NoCommentsMessage>
        );
    }

    // Don't render if we've exceeded max depth
    if (level >= MAX_COMMENT_DEPTH) {
        return null;
    }

    return (
        <CommentListContainer
            $level={level}
            role={level === 0 ? 'list' : undefined}
            aria-label={
                level === 0 ? 'Comments' : `Nested replies level ${level}`
            }
        >
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    slug={slug}
                    title={title}
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
