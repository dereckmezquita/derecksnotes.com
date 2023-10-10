import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import api_new_comment from '@utils/api/interact/new_comment';

import Button from '@components/atomic/Button';

import IndicateLoading from '@components/ui/IndicateLoading';
import IndicateError from '@components/ui/IndicateError';
import IndicateSuccess from '@components/ui/IndicateSuccess';

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
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [shouldRenderMessage, setShouldRenderMessage] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);  // Set loading state
        setMessage(null); // Clear any existing messages
        if (comment.trim()) {
            try {
                const response = await api_new_comment(comment, slug, parentComment);
                setIsLoading(false); // Reset loading state
                if (response) {
                    onSubmit(response);
                    setComment('');
                    setMessage('Comment posted successfully'); // Set success message
                } else {
                    setMessage('Failed to post comment'); // Handle non-successful response here
                }
            } catch (error: any) {
                setIsLoading(false); // Reset loading state
                setMessage('An error occurred while posting the comment'); // Set error message
                console.error("Error submitting the comment:", error.message);
            }
        } else {
            setIsLoading(false); // Reset loading state
            setMessage('Comment cannot be empty'); // Set message for empty comment
        }
    };

    // Function to clear the message and initiate the "animate out" process
    const clearMessage = () => {
        setShouldRenderMessage(false);
    };

    useEffect(() => {
        if (message) {
            setShouldRenderMessage(true);
            // Optionally, clear the message after a timeout, for example, 5 seconds
            const timerId = setTimeout(() => {
                clearMessage();
            }, 1000);

            // Cleanup
            return () => {
                clearTimeout(timerId);
            };
        }
    }, [message]);

    return (
        <Form onSubmit={handleSubmit}>
            {parentComment ? null : <h2 style={{ marginTop: '20px' }}>Comments</h2>}
            <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={1}
            />
            <Button type="submit" disabled={isLoading}>Post</Button>
            {isLoading &&
                <IndicateLoading />
            }
            {message && shouldRenderMessage && (
                message === 'Comment posted successfully' ?
                    <IndicateSuccess message={message} shouldRender={shouldRenderMessage} /> :
                    <IndicateError message={message} shouldRender={shouldRenderMessage} />
            )}
        </Form>
    );
};

export default CommentForm;