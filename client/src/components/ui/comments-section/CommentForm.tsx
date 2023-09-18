import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

const Form = styled.form`
    background-color: ${theme.container.background.colour.primary()};
    border-top: 1px dashed ${theme.container.border.colour.primary()};
    margin-top: 30px;
    padding: 5px;
    padding-top: 10px;
    border-radius: 5px;
    margin-bottom: 30px;
`;

const Input = styled.textarea`
    width: 100%;
    padding: 10px;
    font-family: ${theme.text.font.arial};
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    margin-bottom: 10px;
    resize: vertical;
    min-height: 100px;
`;

const SubmitButton = styled.button`
    padding: 5px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: hsl(205, 70%, 50%);
    color: white;
`;

interface CommentFormProps {
    onSubmit: (comment: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            onSubmit(comment);
            setComment('');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Comments</h2>
            <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={1}
            />
            <SubmitButton type="submit">Post</SubmitButton>
        </Form>
    );
};

export default CommentForm;