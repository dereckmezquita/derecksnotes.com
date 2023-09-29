import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import api_new_comment from '@utils/api/interact/new_comment';

import Button from '@components/atomic/Button';

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

interface CommentFormProps {
    slug: string; // article slug the form is on
    onSubmit: (comment: string) => void; // allows parent to update state with new comment; [newComment, ...comments]
}

const CommentForm: React.FC<CommentFormProps> = ({ slug, onSubmit }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            try {
                const response = await api_new_comment(comment, slug);
                // Handle successful comment submission if needed (e.g., provide user feedback)
                onSubmit(comment);
                setComment('');
            } catch (error: any) {
                // Handle the error (e.g., show a notification or error message to the user)
                console.error("Error submitting the comment:", error.message);
            }
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
            <Button type="submit">Post</Button>
        </Form>
    );
};

export default CommentForm;