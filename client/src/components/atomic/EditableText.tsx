import React, { useState } from 'react';
import styled from 'styled-components';

const EditInput = styled.input`
    border: 1px solid #ccc;
    padding: 5px;
    margin-right: 5px;
`;

const EditText = styled.span`
    cursor: pointer;

    &:hover {
        border-bottom: 1px dashed;
    }
`;

interface EditableTextProps {
    initialText: string;
    onSubmit: (newText: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({ initialText, onSubmit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);

    const handleTextClick = () => {
        setIsEditing(true);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleTextSubmit = () => {
        setIsEditing(false);
        onSubmit(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleTextSubmit();
        if (e.key === 'Escape') setIsEditing(false);
    };

    return (
        <>
            {isEditing ? (
                <EditInput
                    autoFocus
                    value={text}
                    onChange={handleTextChange}
                    onBlur={handleTextSubmit}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <EditText onClick={handleTextClick}>{text}</EditText>
            )}
        </>
    );
};

export default EditableText;