import React, { useState } from 'react';
import { MAX_COMMENT_LENGTH } from '@lib/constants';
import { CommentFormProps } from './types';
import {
    FormContainer,
    TextArea,
    CharacterCount,
    ButtonsContainer,
    SubmitButton,
    CancelButton,
    FormattingTips
} from './CommentStyles';

export function CommentForm({
    onSubmit,
    initialValue = '',
    submitLabel = 'Post Comment',
    onCancel,
    isReply = false,
    isEdit = false
}: CommentFormProps) {
    const [text, setText] = useState(initialValue);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const charCount = text.length;
    const isNearLimit = charCount > MAX_COMMENT_LENGTH * 0.8;
    const isOverLimit = charCount > MAX_COMMENT_LENGTH;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (text.trim() && !isOverLimit && !isSubmitting) {
            setIsSubmitting(true);
            try {
                await onSubmit(text.trim());
                if (!isEdit) {
                    setText(''); // Only clear for new comments, not edits
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <FormContainer isReply={isReply} isEdit={isEdit}>
            <form onSubmit={handleSubmit}>
                <TextArea
                    placeholder={
                        isReply ? 'Write a reply...' : 'Write a comment...'
                    }
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={isReply ? 3 : 4}
                />

                <CharacterCount nearLimit={isNearLimit} overLimit={isOverLimit}>
                    {charCount}/{MAX_COMMENT_LENGTH} characters
                </CharacterCount>

                <ButtonsContainer>
                    <SubmitButton
                        type="submit"
                        disabled={!text.trim() || isOverLimit || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : submitLabel}
                    </SubmitButton>

                    {onCancel && (
                        <CancelButton type="button" onClick={onCancel}>
                            Cancel
                        </CancelButton>
                    )}
                </ButtonsContainer>

                <FormattingTips>
                    Supports Markdown: <b>**bold**</b>, <i>*italic*</i>,
                    [link](url), `code`, ```codeblock```, `&gt;` quote, * list,
                    ## headings
                </FormattingTips>
            </form>
        </FormContainer>
    );
}
