import React from 'react';
import styled from 'styled-components';
import Comment from './Comment';

const ListContainer = styled.div`
    /* Add any desired styling for the container of the comments here */
`;

interface CommentListProps {
    comments: CommentInfo[];
    currentUserId: string;
    onReply?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, currentUserId, onReply, onEdit, onDelete }) => {
    return (
        <ListContainer>
            {comments.map(comment => (
                <Comment 
                    key={comment._id} 
                    comment={comment} 
                    currentUserId={currentUserId} 
                    onReply={onReply} 
                    onEdit={onEdit} 
                    onDelete={onDelete}
                />
            ))}
        </ListContainer>
    );
};

export default CommentList;