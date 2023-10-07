import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import api_new_comment from '@utils/api/interact/new_comment';

import Button from '@components/atomic/Button';

const Form = styled.form`
    background-color: ${theme.container.background.colour.primary()};
    border-top: 1px dashed ${theme.container.border.colour.primary()};
    margin-top: 20px;
    margin-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
`;

const Input = styled.textarea`
    width: 100%;
    padding: 10px;
    font-family: ${theme.text.font.arial};
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
    resize: vertical;
    min-height: 100px;
`;

interface CommentFormProps {
    slug: string;
    parentComment?: string;
    onSubmit: (comment: CommentPopUserDTO) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ slug, parentComment, onSubmit }) => {
    const [comment, setComment] = useState('');

    // Inside CommentForm component

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            try {
                const response = await api_new_comment(comment, slug, parentComment);
                if (response) {
                    onSubmit(response);
                }
                setComment('');
            } catch (error: any) {
                console.error("Error submitting the comment:", error.message);
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {parentComment ? null : <h2 style={{ marginTop: '20px' }}>Comments</h2>}
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