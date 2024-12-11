import React from 'react';
import styled from 'styled-components';
import { CommentItem } from './CommentItem';

interface CommentListProps {
    comments: any[];
    postSlug: string;
}

const CommentListContainer = styled.div`
    margin-top: 20px;
`;

export function CommentList({ comments, postSlug }: CommentListProps) {
    return (
        <CommentListContainer>
            {comments.length === 0 ? (
                <p>No comments yet. Be the first to comment!</p>
            ) : (
                comments.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        postSlug={postSlug}
                    />
                ))
            )}
        </CommentListContainer>
    );
}
