import React, { useState } from 'react';
import styled from 'styled-components';

interface CommentFormProps {
    onSubmit: (text: string) => void;
}

const FormContainer = styled.div`
    margin-bottom: 20px;
`;

const TextArea = styled.textarea`
    width: 100%;
    height: 80px;
    padding: 10px;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
    margin-bottom: 10px;
    resize: vertical;
`;

const SubmitButton = styled.button`
    padding: 8px 15px;
    background-color: ${(props) => props.theme.theme_colours[5]()};
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-weight: bold;
    &:hover {
        background-color: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 80)};
    }
`;

export function CommentForm({ onSubmit }: CommentFormProps) {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSubmit(text.trim());
            setText('');
        }
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <TextArea
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <SubmitButton type="submit">Post Comment</SubmitButton>
            </form>
        </FormContainer>
    );
}
