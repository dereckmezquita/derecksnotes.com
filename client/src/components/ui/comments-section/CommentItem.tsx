import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

const CommentContainer = styled.div`
    background-color: ${theme.container.background.colour.primary()};
    border: 1px solid ${theme.container.border.colour.primary()};
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // Adding a subtle shadow

    &:hover {
        background-color: ${theme.container.background.colour.primary()};
        transition: background-color 0.3s ease;
    }
`;

const CommentText = styled.p`
    font-family: ${theme.text.font.times};
    font-size: 0.9em;
    margin-bottom: 10px;
`;

const RepliesContainer = styled.div`
    position: relative;
    margin-left: 30px;

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: -10px;
        width: 2px;
        height: 100%;
        background-color: ${theme.container.border.colour.primary()};
    }
`;

interface Comment {
    id: string;
    text: string;
    replies: Comment[]; // Each comment can have replies
}

interface CommentItemProps {
    comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    return (
        <CommentContainer>
            <CommentText>{comment.text}</CommentText>
            <RepliesContainer>
                {comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} />
                ))}
            </RepliesContainer>
        </CommentContainer>
    );
};

export default CommentItem;
