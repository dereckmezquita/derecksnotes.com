import React from 'react';
import styled from 'styled-components';
import Comment from './Comment';

const ListContainer = styled.div`
    /* Add any desired styling for the container of the comments here */
`;

interface UserComment {
    id: string;
    text: string;
}

interface CommentListProps {
    comments: UserComment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    return (
        <ListContainer>
            {comments.map(comment => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </ListContainer>
    );
};

export default CommentList;