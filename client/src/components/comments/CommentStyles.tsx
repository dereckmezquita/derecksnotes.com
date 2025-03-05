import styled from 'styled-components';

// Container styles
export const CommentsContainer = styled.div`
    margin-top: 40px;
    padding: 20px;
    background-color: ${(props) =>
        props.theme.container.background.colour.content()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${(props) => props.theme.container.shadow.box};
    color: ${(props) => props.theme.text.colour.primary()};
`;

export const CommentsTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 1.4em;
    font-variant: small-caps;
    color: ${(props) => props.theme.text.colour.primary()};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding-bottom: 10px;
`;

// Comment item styles
export const SingleComment = styled.div<{
    isDeleted?: boolean;
    isEditing?: boolean;
}>`
    position: relative;
    padding: 15px 0;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    opacity: ${(props) => (props.isDeleted ? 0.7 : 1)};

    &:last-child {
        border-bottom: none;
    }

    ${(props) =>
        props.isEditing &&
        `
        background-color: ${props.theme.container.background.colour.light_contrast()};
        border-radius: 5px;
        padding: 15px;
        margin: 5px 0;
    `}
`;

export const CommentHeader = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
`;

export const CommentAuthor = styled.span`
    font-weight: bold;
    color: ${(props) => props.theme.text.colour.primary()};
    font-size: 0.95em;
`;

export const CommentMetadata = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

export const CommentDate = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: 0.85em;
    position: relative;
    cursor: ${(props) => (props['data-title'] ? 'help' : 'default')};

    /* Custom tooltip styling using data-title instead of title to avoid native tooltips */
    &[data-title]:not([data-title='']):hover::after {
        content: attr(data-title);
        position: absolute;
        left: 0;
        top: 100%;
        z-index: 100;
        background-color: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        margin-top: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        pointer-events: none;
    }
`;

export const EditedMark = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: 0.8em;
    font-style: italic;
`;

export const CommentText = styled.div<{ deleted?: boolean }>`
    margin: 10px 0;
    color: ${(props) =>
        props.deleted
            ? props.theme.text.colour.light_grey()
            : props.theme.text.colour.primary()};
    font-size: 0.95em;
    line-height: 1.6;
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    font-style: ${(props) => (props.deleted ? 'italic' : 'normal')};

    p {
        margin: 0.5em 0;

        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }

    ul,
    ol {
        margin: 0.5em 0;
        padding-left: 1.5em;
    }

    code {
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        padding: 2px 4px;
        border-radius: 3px;
        font-family: monospace;
        font-size: 0.9em;
    }

    pre {
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        padding: 8px;
        border-radius: 4px;
        overflow-x: auto;
        margin: 0.5em 0;
    }

    a {
        color: ${(props) => props.theme.text.colour.anchor()};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export const DeletedText = styled.p`
    font-style: italic;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

// Comment actions
export const CommentActions = styled.div`
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
`;

export const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.text.colour.anchor()};
    cursor: pointer;
    font-size: 0.85em;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0;
    transition: color 0.2s;

    &:hover {
        color: ${(props) =>
            props.theme.text.colour.anchor(undefined, undefined, 80)};
        text-decoration: underline;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const ReplyContainer = styled.div<{ level: number }>`
    margin-left: ${(props) => (props.level < 3 ? '20px' : '0')};
    padding-left: ${(props) => (props.level < 3 ? '15px' : '0')};
    border-left: ${(props) =>
        props.level < 3
            ? `1px solid ${props.theme.container.border.colour.primary()}`
            : 'none'};
    margin-top: ${(props) => (props.level < 3 ? '10px' : '20px')};
`;

export const CommentControls = styled.div`
    margin-left: auto;
    display: flex;
    gap: 5px;
`;

export const ReactionButton = styled.button<{ isActive?: boolean }>`
    background: none;
    border: 1px solid transparent;
    border-radius: ${(props) => props.theme.container.border.radius};
    padding: 3px 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${(props) =>
        props.isActive
            ? props.theme.theme_colours[5]()
            : props.theme.text.colour.light_grey()};
    font-size: 0.85em;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: ${(props) =>
            props.isActive
                ? props.theme.theme_colours[5]()
                : props.theme.text.colour.anchor()};
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        border-color: ${(props) =>
            props.theme.container.border.colour.primary()};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        border-color: transparent;
        background-color: transparent;
    }
`;

export const ReactionCount = styled.span`
    font-size: 0.85em;
`;

export const LoadMoreRepliesButton = styled.button`
    background: none;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
    color: ${(props) => props.theme.text.colour.primary()};
    padding: 5px 10px;
    font-size: 0.85em;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 5px;

    &:hover {
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
    }
`;

// Form styles
export const FormContainer = styled.div<{
    isReply?: boolean;
    isEdit?: boolean;
}>`
    margin-bottom: ${(props) =>
        props.isReply || props.isEdit ? '15px' : '20px'};
`;

export const TextArea = styled.textarea`
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

export const ButtonsContainer = styled.div`
    display: flex;
    gap: 10px;
    justify-content: flex-start;
`;

export const Button = styled.button`
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

export const SubmitButton = styled(Button)`
    background-color: ${(props) => props.theme.theme_colours[5]()};
    color: white;
    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 80)};
    }
`;

export const CancelButton = styled(Button)`
    background-color: transparent;
    color: ${(props) => props.theme.text.colour.anchor()};
    &:hover {
        text-decoration: underline;
    }
`;

export const CharacterCount = styled.div<{
    nearLimit: boolean;
    overLimit: boolean;
}>`
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

export const FormattingTips = styled.div`
    font-size: 0.8em;
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-top: 5px;
`;

// Comments list styles
export const CommentListContainer = styled.div<{ level?: number }>`
    margin-top: ${(props) => (props.level === 0 ? '20px' : '10px')};
    position: relative;
`;

export const NoCommentsMessage = styled.p`
    font-style: italic;
    color: ${(props) => props.theme.text.colour.light_grey()};
    text-align: center;
    margin: 20px 0;
`;

// History modal styles
export const HistoryModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const HistoryContent = styled.div`
    background-color: ${(props) =>
        props.theme.container.background.colour.primary()};
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
`;

export const HistoryTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

export const HistoryItem = styled.div`
    margin-bottom: 20px;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding-bottom: 15px;

    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
`;

export const HistoryItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

export const HistoryDate = styled.span`
    font-size: 0.9em;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

export const HistoryText = styled.div`
    font-size: 0.95em;
    line-height: 1.5;
    color: ${(props) => props.theme.text.colour.primary()};
    white-space: pre-wrap;
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: ${(props) => props.theme.text.colour.primary()};

    &:hover {
        color: ${(props) => props.theme.text.colour.anchor()};
    }
`;

export const DiffView = styled.div`
    margin-top: 15px;
    padding: 10px;
    background-color: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-radius: 4px;
`;

export const DiffLine = styled.div<{ type: 'added' | 'removed' | 'unchanged' }>`
    padding: 2px 0;
    font-family: monospace;
    white-space: pre-wrap;
    font-size: 0.9em;

    ${(props) =>
        props.type === 'added' &&
        `
        background-color: rgba(0, 255, 0, 0.1);
        color: green;
    `}

    ${(props) =>
        props.type === 'removed' &&
        `
        background-color: rgba(255, 0, 0, 0.1);
        color: red;
        text-decoration: line-through;
    `}
`;

// Pagination styles
export const PaginationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

export const PaginationInfoText = styled.span`
    font-size: 0.9em;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

export const PaginationButtons = styled.div`
    display: flex;
    gap: 10px;
`;

export const PageButton = styled.button<{ active?: boolean }>`
    padding: 5px 10px;
    background-color: ${(props) =>
        props.active
            ? props.theme.theme_colours[5]()
            : props.theme.container.background.colour.content()};
    color: ${(props) =>
        props.active ? 'white' : props.theme.text.colour.primary()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.9em;

    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.active
                ? props.theme.theme_colours[5](undefined, undefined, 80)
                : props.theme.container.background.colour.light_contrast()};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const LoadingSpinner = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-left-color: ${(props) => props.theme.theme_colours[5]()};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

// Profile view specific styles
export const ProfileCommentItem = styled.div<{
    selected?: boolean;
    deleted?: boolean;
}>`
    border: 1px solid
        ${(props) =>
            props.selected
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    padding: 15px;
    background: ${(props) =>
        props.selected
            ? props.theme.theme_colours[9]()
            : props.deleted
              ? '#f8f8f8'
              : props.theme.container.background.colour.content()};
    transition: all 0.2s ease;

    &:hover {
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

export const PostLink = styled.a`
    color: ${(props) => props.theme.text.colour.anchor()};
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: ${(props) => props.theme.text.size.small};

    &:hover {
        text-decoration: underline;
    }
`;
