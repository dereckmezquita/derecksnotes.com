import React from 'react';
import styled from 'styled-components';
import Comment from './Comment';

const ListContainer = styled.div`
    /* Add any desired styling for the container of the comments here */
`;

interface User {
    id: string;
    username: string;
    profileImage: string;
}

interface UserComment {
    id: string;
    text: string;
    author: User;
    replies: UserComment[];
}

interface CommentListProps {
    comments: UserComment[];
    currentUserId: string;
}

const CommentList: React.FC<CommentListProps> = ({ comments, currentUserId }) => {
    return (
        <ListContainer>
            {comments.map(comment => (
                <Comment key={comment.id} comment={comment} userId={currentUserId} />
            ))}
        </ListContainer>
    );
};

export default CommentList;