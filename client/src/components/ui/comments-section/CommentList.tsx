import React from 'react';
import styled from 'styled-components';
import CommentItem from './CommentItem';

const ListContainer = styled.div`
    /* Add any desired styling for the container of the comments here */
`;

interface Comment {
    id: string;
    text: string;
}

interface CommentListProps {
    comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    return (
        <ListContainer>
            {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </ListContainer>
    );
};

export default CommentList;
