import React, { useState } from 'react';
import { useRouter } from 'next/router';
// --------------------------------------
import styled from 'styled-components';
import { theme } from '@styles/theme';
// --------------------------------------
import api_new_comment from '@utils/api/interact/new_comment';
// --------------------------------------
import Button from '@components/atomic/Button';
import IndicateLoading from '@components/atomic/IndicateLoading';
import api_edit_comment from '@utils/api/interact/edit_comment';

const Form = styled.form`
    background-color: ${theme.container.background.colour.primary()};
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
`;

const Input = styled.textarea`
    width: 100%;
    padding: 10px;
    font-family: ${theme.text.font.arial};
    border: 2px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
    resize: vertical;
    min-height: 100px;
`;

interface CommentFormProps {
    parentComment?: string;
    onSubmit: (comment: CommentPopUserDTO) => void; // callback sends new comment to parent component
    editComment?: CommentPopUserDTO;
}

const CommentForm: React.FC<CommentFormProps> = ({ parentComment, onSubmit, editComment }) => {
    const router = useRouter();
    const [error, setError] = useState<string>('');

    const [commentInput, setCommentInput] = useState(editComment?.latestContent?.comment || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (editComment) {
            // If defaultValue prop is passed, this form is being used to edit a comment
            // so we need to call the edit comment API instead of new comment API
            try {
                const res: CommentPopUserDTO = await api_edit_comment(editComment._id!, commentInput);
                setIsLoading(false);
                if (res) {
                    res.childComments = editComment.childComments;
                    onSubmit(res);
                }
            } catch (error) {
                setIsLoading(false);
            }

            return;
        }


        if (commentInput.trim()) {
            try {
                const res = await api_new_comment(commentInput, router.asPath, parentComment);
                setIsLoading(false);
                if (res) {
                    onSubmit(res);
                    setCommentInput('');
                }
            } catch (error: any) {
                setIsLoading(false);
                setError(error?.message || 'An error occurred; please verify e-mail.');
            }
        } else {
            setIsLoading(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder='Write a comment...'
                rows={1}
            />
            <Button type='submit' disabled={isLoading}>
                Post
            </Button>
            {isLoading && <IndicateLoading />}
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </Form>
    )
}

export default CommentForm;