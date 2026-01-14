import React, { useState, useRef, useEffect, useCallback } from 'react';
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const charCount = text.length;
    const isNearLimit = charCount > MAX_COMMENT_LENGTH * 0.8;
    const isOverLimit = charCount > MAX_COMMENT_LENGTH;

    // Focus textarea on mount for edit/reply mode
    useEffect(() => {
        if ((isReply || isEdit) && textareaRef.current) {
            textareaRef.current.focus();
            // Move cursor to end of text
            const len = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(len, len);
        }
    }, [isReply, isEdit]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
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
        },
        [text, isOverLimit, isSubmitting, onSubmit, isEdit]
    );

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            // Cmd/Ctrl + Enter to submit
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
            }

            // Escape to cancel (if cancel handler exists)
            if (e.key === 'Escape' && onCancel) {
                e.preventDefault();
                onCancel();
            }
        },
        [handleSubmit, onCancel]
    );

    return (
        <FormContainer $isReply={isReply} $isEdit={isEdit}>
            <form onSubmit={handleSubmit}>
                <TextArea
                    ref={textareaRef}
                    placeholder={
                        isReply ? 'Write a reply...' : 'Write a comment...'
                    }
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={isReply ? 3 : 4}
                    aria-label={isReply ? 'Reply text' : 'Comment text'}
                    aria-describedby="char-count formatting-tips"
                    aria-invalid={isOverLimit}
                />

                <CharacterCount
                    id="char-count"
                    $nearLimit={isNearLimit}
                    $overLimit={isOverLimit}
                    role="status"
                    aria-live="polite"
                >
                    {charCount}/{MAX_COMMENT_LENGTH} characters
                    {isOverLimit && ' (over limit)'}
                </CharacterCount>

                <ButtonsContainer>
                    <SubmitButton
                        type="submit"
                        disabled={!text.trim() || isOverLimit || isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : submitLabel}
                    </SubmitButton>

                    {onCancel && (
                        <CancelButton type="button" onClick={onCancel}>
                            Cancel
                        </CancelButton>
                    )}
                </ButtonsContainer>

                <FormattingTips id="formatting-tips">
                    Supports Markdown: <b>**bold**</b>, <i>*italic*</i>,
                    [link](url), `code`, ```codeblock```, `&gt;` quote, * list,
                    ## headings
                    <br />
                    <small>
                        Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to submit
                    </small>
                </FormattingTips>
            </form>
        </FormContainer>
    );
}
