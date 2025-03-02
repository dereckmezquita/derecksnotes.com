import React, { useState } from 'react';
import styled from 'styled-components';
import { MAX_COMMENT_LENGTH } from '@lib/constants';

interface CommentFormProps {
    onSubmit: (text: string) => void;
    initialValue?: string;
    submitLabel?: string;
    onCancel?: () => void;
    isReply?: boolean;
    isEdit?: boolean;
}

const FormContainer = styled.div<{ isReply?: boolean; isEdit?: boolean }>`
    margin-bottom: ${(props) =>
        props.isReply || props.isEdit ? '15px' : '20px'};
`;

const TextArea = styled.textarea`
    width: 100%;
    height: 80px;
    padding: 10px;
    margin-bottom: 10px;
    font-family: ${(props) => props.theme.text.font.times};
    font-size: 0.95em;
    line-height: 1.4;
    color: ${(props) => props.theme.text.colour.primary()};
    background-color: ${(props) =>
        props.theme.container.background.colour.content()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.theme_colours[5]()};
        box-shadow: 0 0 0 1px
            ${(props) => props.theme.theme_colours[5](undefined, undefined, 30)};
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 10px;
    justify-content: flex-start;
`;

const Button = styled.button`
    padding: 8px 15px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.9em;
    transition: background-color 0.2s ease;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const SubmitButton = styled(Button)`
    background-color: ${(props) => props.theme.theme_colours[5]()};
    color: white;
    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 80)};
    }
`;

const CancelButton = styled(Button)`
    background-color: transparent;
    color: ${(props) => props.theme.text.colour.anchor()};
    &:hover {
        text-decoration: underline;
    }
`;

const CharacterCount = styled.div<{ nearLimit: boolean; overLimit: boolean }>`
    text-align: right;
    font-size: 0.8em;
    margin-top: -5px;
    margin-bottom: 8px;
    color: ${(props) =>
        props.overLimit
            ? 'red'
            : props.nearLimit
              ? 'orange'
              : props.theme.text.colour.light_grey()};
`;

const FormattingTips = styled.div`
    font-size: 0.8em;
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-top: 5px;
`;

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
                    Supports basic formatting: <b>**bold**</b>, <i>*italic*</i>,
                    [link](url), `code`
                </FormattingTips>
            </form>
        </FormContainer>
    );
}
