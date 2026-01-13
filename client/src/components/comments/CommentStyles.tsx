import styled, { css, keyframes } from 'styled-components';

// ============================================================================
// ANIMATIONS
// ============================================================================

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const slideIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

// ============================================================================
// CONTAINER STYLES
// ============================================================================

export const CommentsContainer = styled.div`
    margin-top: ${(props) => props.theme.container.spacing.xlarge};
    padding: ${(props) => props.theme.container.spacing.medium};
    background-color: ${(props) =>
        props.theme.container.background.colour.content()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    box-shadow: ${(props) => props.theme.container.shadow.box};
    color: ${(props) => props.theme.text.colour.primary()};

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        padding: ${(props) => props.theme.container.spacing.small};
        margin-top: ${(props) => props.theme.container.spacing.large};
    }
`;

export const CommentsTitle = styled.h2`
    margin: 0 0 ${(props) => props.theme.container.spacing.medium} 0;
    font-size: ${(props) => props.theme.text.size.large};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-variant: small-caps;
    color: ${(props) => props.theme.text.colour.header()};
    border-bottom: 2px solid
        ${(props) => props.theme.theme_colours[5](undefined, undefined, 80)};
    padding-bottom: ${(props) => props.theme.container.spacing.xsmall};
`;

// ============================================================================
// COMMENT ITEM STYLES
// ============================================================================

export const SingleComment = styled.div<{
    isDeleted?: boolean;
    isEditing?: boolean;
}>`
    position: relative;
    padding: ${(props) => props.theme.container.spacing.small} 0;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    opacity: ${(props) => (props.isDeleted ? 0.6 : 1)};
    transition: all 0.2s ease;
    animation: ${fadeIn} 0.3s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${(props) =>
            props.isEditing
                ? props.theme.container.background.colour.light_contrast()
                : 'transparent'};
    }

    ${(props) =>
        props.isEditing &&
        css`
            background-color: ${props.theme.container.background.colour.light_contrast()};
            border-radius: ${props.theme.container.border.radius};
            padding: ${props.theme.container.spacing.small};
            margin: ${props.theme.container.spacing.xsmall} 0;
            border-bottom: none;
        `}
`;

export const CommentHeader = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
    margin-bottom: ${(props) => props.theme.container.spacing.small};

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        flex-direction: column;
        align-items: flex-start;
        gap: ${(props) => props.theme.container.spacing.xsmall};
    }
`;

export const CommentAuthorName = styled.span`
    font-weight: ${(props) => props.theme.text.weight.bold};
    color: ${(props) => props.theme.theme_colours[5]()};
    font-size: ${(props) => props.theme.text.size.normal};
    transition: color 0.2s ease;

    &:hover {
        color: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 40)};
    }
`;

export const CommentMetadata = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
    flex-wrap: wrap;
`;

export const CommentDate = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: ${(props) => props.theme.text.size.small};
    position: relative;
    cursor: ${(props) => (props['data-title'] ? 'help' : 'default')};

    &[data-title]:not([data-title='']):hover::after {
        content: attr(data-title);
        position: absolute;
        left: 0;
        top: 100%;
        z-index: 100;
        background-color: ${(props) => props.theme.colours.darkGray};
        color: ${(props) => props.theme.text.colour.white()};
        padding: ${(props) => props.theme.container.spacing.small}
            ${(props) => props.theme.container.spacing.medium};
        border-radius: ${(props) => props.theme.container.border.radius};
        font-size: ${(props) => props.theme.text.size.small};
        white-space: nowrap;
        margin-top: ${(props) => props.theme.container.spacing.xsmall};
        box-shadow: ${(props) => props.theme.container.shadow.box};
        pointer-events: none;
        animation: ${fadeIn} 0.15s ease;
    }
`;

export const EditedMark = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: ${(props) => props.theme.text.size.small};
    font-style: italic;
`;

export const PendingBadge = styled.span`
    background-color: ${(props) => props.theme.colours.warning};
    color: ${(props) => props.theme.colours.darkGray};
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: ${(props) => props.theme.container.border.radius};
    font-weight: ${(props) => props.theme.text.weight.medium};
`;

// ============================================================================
// COMMENT CONTENT STYLES
// ============================================================================

export const CommentText = styled.div<{ deleted?: boolean }>`
    margin: ${(props) => props.theme.container.spacing.xsmall} 0;
    color: ${(props) =>
        props.deleted
            ? props.theme.text.colour.light_grey()
            : props.theme.text.colour.primary()};
    font-size: ${(props) => props.theme.text.size.normal};
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
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 0.9em;
        color: ${(props) => props.theme.colours.accent1};
    }

    pre {
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        padding: ${(props) => props.theme.container.spacing.medium};
        border-radius: ${(props) => props.theme.container.border.radius};
        overflow-x: auto;
        margin: 0.5em 0;
        border: 1px solid
            ${(props) => props.theme.container.border.colour.primary()};

        code {
            background: none;
            padding: 0;
            color: inherit;
        }
    }

    blockquote {
        border-left: 3px solid ${(props) => props.theme.theme_colours[5]()};
        margin: 0.5em 0;
        padding-left: ${(props) => props.theme.container.spacing.medium};
        color: ${(props) => props.theme.text.colour.light_grey()};
        font-style: italic;
    }

    a {
        color: ${(props) => props.theme.text.colour.anchor()};
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
            text-decoration: underline;
            color: ${(props) =>
                props.theme.text.colour.anchor(undefined, undefined, 40)};
        }
    }

    img {
        max-width: 100%;
        border-radius: ${(props) => props.theme.container.border.radius};
    }
`;

export const DeletedText = styled.p`
    font-style: italic;
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin: 0;
`;

// ============================================================================
// COMMENT ACTIONS
// ============================================================================

export const CommentActions = styled.div`
    margin-top: ${(props) => props.theme.container.spacing.small};
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.container.spacing.medium};
    align-items: center;

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        gap: ${(props) => props.theme.container.spacing.small};
    }
`;

export const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.text.colour.anchor()};
    cursor: pointer;
    font-size: ${(props) => props.theme.text.size.small};
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    padding: ${(props) => props.theme.container.spacing.xsmall}
        ${(props) => props.theme.container.spacing.small};
    border-radius: ${(props) => props.theme.container.border.radius};
    transition: all 0.2s ease;
    min-height: 32px;

    &:hover {
        color: ${(props) =>
            props.theme.text.colour.anchor(undefined, undefined, 40)};
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
    }

    &:focus {
        outline: 2px solid ${(props) => props.theme.theme_colours[5]()};
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: none;
    }

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        min-height: 44px;
        padding: ${(props) => props.theme.container.spacing.small};
    }
`;

export const CommentControls = styled.div`
    margin-left: auto;
    display: flex;
    gap: ${(props) => props.theme.container.spacing.xsmall};

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        margin-left: 0;
        margin-top: ${(props) => props.theme.container.spacing.xsmall};
    }
`;

export const ReactionButton = styled.button<{ isActive?: boolean }>`
    background: ${(props) =>
        props.isActive ? props.theme.theme_colours[9]() : 'none'};
    border: 1px solid
        ${(props) =>
            props.isActive ? props.theme.theme_colours[5]() : 'transparent'};
    border-radius: ${(props) => props.theme.container.border.radius};
    padding: ${(props) => props.theme.container.spacing.xsmall}
        ${(props) => props.theme.container.spacing.small};
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    color: ${(props) =>
        props.isActive
            ? props.theme.theme_colours[5]()
            : props.theme.text.colour.light_grey()};
    font-size: ${(props) => props.theme.text.size.small};
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 32px;

    svg {
        transition: transform 0.2s ease;
    }

    &:hover:not(:disabled) {
        color: ${(props) => props.theme.theme_colours[5]()};
        background-color: ${(props) => props.theme.theme_colours[9]()};
        border-color: ${(props) =>
            props.theme.container.border.colour.primary()};

        svg {
            transform: scale(1.1);
        }
    }

    &:focus {
        outline: 2px solid ${(props) => props.theme.theme_colours[5]()};
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: none;
        border-color: transparent;
    }

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        min-height: 44px;
        padding: ${(props) => props.theme.container.spacing.small};
    }
`;

export const ReactionCount = styled.span`
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) => props.theme.text.weight.medium};
`;

// ============================================================================
// NESTED REPLIES
// ============================================================================

const getDepthColor = (depth: number, theme: any) => {
    const colors = [
        theme.theme_colours[5](),
        theme.theme_colours[5](undefined, undefined, 60),
        theme.theme_colours[5](undefined, undefined, 70),
        theme.theme_colours[5](undefined, undefined, 80),
        theme.container.border.colour.primary()
    ];
    return colors[Math.min(depth, colors.length - 1)];
};

export const ReplyContainer = styled.div<{ level: number }>`
    margin-left: ${(props) => {
        if (props.level >= 4) return '8px';
        if (props.level >= 2) return '16px';
        return '24px';
    }};
    padding-left: ${(props) => props.theme.container.spacing.small};
    border-left: 2px solid ${(props) => getDepthColor(props.level, props.theme)};
    margin-top: ${(props) => props.theme.container.spacing.xsmall};
    position: relative;

    &::before {
        content: '';
        position: absolute;
        left: -2px;
        top: 0;
        width: 2px;
        height: 20px;
        background: linear-gradient(
            to bottom,
            transparent,
            ${(props) => getDepthColor(props.level, props.theme)}
        );
    }

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        margin-left: ${(props) => props.theme.container.spacing.small};
        padding-left: ${(props) => props.theme.container.spacing.small};
    }
`;

export const CollapseButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.text.colour.light_grey()};
    cursor: pointer;
    font-size: ${(props) => props.theme.text.size.small};
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    padding: ${(props) => props.theme.container.spacing.xsmall};
    border-radius: ${(props) => props.theme.container.border.radius};
    transition: all 0.2s ease;

    &:hover {
        color: ${(props) => props.theme.theme_colours[5]()};
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
    }
`;

export const ReplyCount = styled.span`
    background-color: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: ${(props) => props.theme.text.weight.medium};
`;

export const LoadMoreRepliesButton = styled.button`
    background: none;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    color: ${(props) => props.theme.text.colour.anchor()};
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    font-size: ${(props) => props.theme.text.size.small};
    cursor: pointer;
    margin-top: ${(props) => props.theme.container.spacing.small};
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
    transition: all 0.2s ease;

    &:hover {
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

// ============================================================================
// FORM STYLES
// ============================================================================

export const FormContainer = styled.div<{
    $isReply?: boolean;
    $isEdit?: boolean;
}>`
    margin-bottom: ${(props) =>
        props.$isReply || props.$isEdit
            ? props.theme.container.spacing.medium
            : props.theme.container.spacing.large};
    animation: ${fadeIn} 0.2s ease;
`;

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 100px;
    padding: ${(props) => props.theme.container.spacing.medium};
    margin-bottom: ${(props) => props.theme.container.spacing.small};
    font-family: ${(props) => props.theme.text.font.times};
    font-size: ${(props) => props.theme.text.size.normal};
    line-height: 1.5;
    color: ${(props) => props.theme.text.colour.primary()};
    background-color: ${(props) =>
        props.theme.container.background.colour.solid()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    resize: vertical;
    transition: all 0.2s ease;

    &::placeholder {
        color: ${(props) => props.theme.text.colour.light_grey()};
    }

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.theme_colours[5]()};
        box-shadow: 0 0 0 3px
            ${(props) =>
                props.theme.theme_colours[5](
                    undefined,
                    undefined,
                    undefined,
                    0.15
                )};
    }

    &:hover:not(:focus) {
        border-color: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 70)};
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    gap: ${(props) => props.theme.container.spacing.small};
    justify-content: flex-start;
    flex-wrap: wrap;
`;

export const Button = styled.button`
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    border: none;
    border-radius: ${(props) => props.theme.container.border.radius};
    cursor: pointer;
    font-weight: ${(props) => props.theme.text.weight.medium};
    font-size: ${(props) => props.theme.text.size.normal};
    transition: all 0.2s ease;
    min-height: 40px;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:focus {
        outline: 2px solid ${(props) => props.theme.theme_colours[5]()};
        outline-offset: 2px;
    }

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        min-height: 44px;
        flex: 1;
    }
`;

export const SubmitButton = styled(Button)`
    background-color: ${(props) => props.theme.theme_colours[5]()};
    color: ${(props) => props.theme.text.colour.white()};

    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 40)};
        transform: translateY(-1px);
        box-shadow: 0 2px 8px
            ${(props) =>
                props.theme.theme_colours[5](
                    undefined,
                    undefined,
                    undefined,
                    0.3
                )};
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
`;

export const CancelButton = styled(Button)`
    background-color: transparent;
    color: ${(props) => props.theme.text.colour.anchor()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};

    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        border-color: ${(props) => props.theme.text.colour.anchor()};
    }
`;

export const CharacterCount = styled.div<{
    $nearLimit: boolean;
    $overLimit: boolean;
}>`
    text-align: right;
    font-size: ${(props) => props.theme.text.size.small};
    margin-bottom: ${(props) => props.theme.container.spacing.small};
    color: ${(props) =>
        props.$overLimit
            ? props.theme.colours.error
            : props.$nearLimit
              ? props.theme.colours.warning
              : props.theme.text.colour.light_grey()};
    transition: color 0.2s ease;
`;

export const FormattingTips = styled.div`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-top: ${(props) => props.theme.container.spacing.small};
    padding: ${(props) => props.theme.container.spacing.small};
    background-color: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-radius: ${(props) => props.theme.container.border.radius};

    b,
    i,
    code {
        font-family: inherit;
    }

    code {
        background-color: ${(props) =>
            props.theme.container.background.colour.solid()};
        padding: 1px 4px;
        border-radius: 2px;
    }
`;

// ============================================================================
// COMMENTS LIST STYLES
// ============================================================================

export const CommentListContainer = styled.div<{ level?: number }>`
    margin-top: ${(props) =>
        props.level === 0
            ? props.theme.container.spacing.medium
            : props.theme.container.spacing.xsmall};
    position: relative;
`;

export const NoCommentsMessage = styled.div`
    text-align: center;
    padding: ${(props) => props.theme.container.spacing.xlarge};
    color: ${(props) => props.theme.text.colour.light_grey()};

    p {
        margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
        font-size: ${(props) => props.theme.text.size.medium};
    }

    span {
        font-size: ${(props) => props.theme.text.size.small};
    }
`;

// ============================================================================
// HISTORY MODAL STYLES
// ============================================================================

export const HistoryModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: ${fadeIn} 0.2s ease;
    padding: ${(props) => props.theme.container.spacing.medium};
`;

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
    background-color: rgba(0, 0, 0, 0.5);
    padding: ${(props) => props.theme.container.spacing.medium};
    animation: ${fadeIn} 0.2s ease;
`;

export const HistoryContent = styled.div`
    position: relative;
    background-color: ${(props) =>
        props.theme.container.background.colour.solid()};
    border-radius: ${(props) => props.theme.container.border.radius};
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: ${(props) => props.theme.container.spacing.large};
    width: 100%;
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    animation: ${slideIn} 0.3s ease;

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        padding: ${(props) => props.theme.container.spacing.medium};
        max-height: 90vh;
    }
`;

export const HistoryTitle = styled.h3`
    margin: 0 0 ${(props) => props.theme.container.spacing.medium} 0;
    padding-bottom: ${(props) => props.theme.container.spacing.small};
    border-bottom: 2px solid
        ${(props) => props.theme.theme_colours[5](undefined, undefined, 80)};
    color: ${(props) => props.theme.text.colour.header()};
    font-size: ${(props) => props.theme.text.size.large};
    padding-right: 40px;
`;

export const CloseButton = styled.button`
    position: absolute;
    top: ${(props) => props.theme.container.spacing.medium};
    right: ${(props) => props.theme.container.spacing.medium};
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${(props) => props.theme.text.colour.light_grey()};
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${(props) => props.theme.container.border.radius};
    transition: all 0.2s ease;

    &:hover {
        color: ${(props) => props.theme.text.colour.primary()};
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
    }

    &:focus {
        outline: 2px solid ${(props) => props.theme.theme_colours[5]()};
        outline-offset: 2px;
    }
`;

export const HistoryItem = styled.div`
    margin-bottom: ${(props) => props.theme.container.spacing.large};
    padding-bottom: ${(props) => props.theme.container.spacing.medium};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};

    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
`;

export const HistoryItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => props.theme.container.spacing.small};
    flex-wrap: wrap;
    gap: ${(props) => props.theme.container.spacing.small};
`;

export const HistoryDate = styled.span`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

export const HistoryVersionBadge = styled.span<{ isCurrent?: boolean }>`
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: ${(props) => props.theme.text.weight.medium};
    background-color: ${(props) =>
        props.isCurrent
            ? props.theme.theme_colours[5]()
            : props.theme.container.background.colour.light_contrast()};
    color: ${(props) =>
        props.isCurrent
            ? props.theme.text.colour.white()
            : props.theme.text.colour.light_grey()};
`;

export const HistoryText = styled.div`
    font-size: ${(props) => props.theme.text.size.normal};
    line-height: 1.6;
    color: ${(props) => props.theme.text.colour.primary()};
    white-space: pre-wrap;
    padding: ${(props) => props.theme.container.spacing.medium};
    background-color: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-radius: ${(props) => props.theme.container.border.radius};
`;

export const DiffView = styled.div`
    margin-top: ${(props) => props.theme.container.spacing.medium};
    padding: ${(props) => props.theme.container.spacing.medium};
    background-color: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-radius: ${(props) => props.theme.container.border.radius};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

export const DiffHeader = styled.div`
    margin-bottom: ${(props) => props.theme.container.spacing.small};
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) => props.theme.text.weight.medium};
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

export const DiffLine = styled.div<{ type: 'added' | 'removed' | 'unchanged' }>`
    padding: 2px ${(props) => props.theme.container.spacing.small};
    font-family: 'Consolas', 'Monaco', monospace;
    white-space: pre-wrap;
    font-size: ${(props) => props.theme.text.size.small};
    border-radius: 2px;
    margin: 1px 0;

    ${(props) =>
        props.type === 'added' &&
        css`
            background-color: ${props.theme.likeBadge.positiveBackground};
            color: ${props.theme.likeBadge.positiveColour};

            &::before {
                content: '+ ';
            }
        `}

    ${(props) =>
        props.type === 'removed' &&
        css`
            background-color: ${props.theme.likeBadge.negativeBackground};
            color: ${props.theme.likeBadge.negativeColour};
            text-decoration: line-through;

            &::before {
                content: '- ';
            }
        `}

    ${(props) =>
        props.type === 'unchanged' &&
        css`
            color: ${props.theme.text.colour.light_grey()};

            &::before {
                content: '  ';
            }
        `}
`;

// ============================================================================
// LOADING & ERROR STATES
// ============================================================================

export const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${(props) => props.theme.container.spacing.xlarge};
    gap: ${(props) => props.theme.container.spacing.medium};
`;

export const LoadingSpinner = styled.div`
    width: 32px;
    height: 32px;
    border: 3px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-top-color: ${(props) => props.theme.theme_colours[5]()};
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.p`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: ${(props) => props.theme.text.size.normal};
    margin: 0;
`;

export const ErrorContainer = styled.div`
    padding: ${(props) => props.theme.container.spacing.large};
    background-color: ${(props) => props.theme.likeBadge.negativeBackground};
    border: 1px solid ${(props) => props.theme.colours.error};
    border-radius: ${(props) => props.theme.container.border.radius};
    color: ${(props) => props.theme.likeBadge.negativeColour};
    text-align: center;

    p {
        margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
    }
`;

export const RetryButton = styled(Button)`
    background-color: ${(props) => props.theme.colours.error};
    color: white;

    &:hover:not(:disabled) {
        background-color: ${(props) => props.theme.likeBadge.negativeColour};
    }
`;

export const LoginPrompt = styled.div`
    padding: ${(props) => props.theme.container.spacing.large};
    background-color: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-radius: ${(props) => props.theme.container.border.radius};
    text-align: center;
    margin-bottom: ${(props) => props.theme.container.spacing.large};

    p {
        margin: 0;
        color: ${(props) => props.theme.text.colour.light_grey()};
        font-size: ${(props) => props.theme.text.size.normal};
    }

    a {
        color: ${(props) => props.theme.text.colour.anchor()};
        font-weight: ${(props) => props.theme.text.weight.medium};
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
`;

// ============================================================================
// PAGINATION STYLES
// ============================================================================

export const PaginationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${(props) => props.theme.container.spacing.large};
    padding-top: ${(props) => props.theme.container.spacing.medium};
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    flex-wrap: wrap;
    gap: ${(props) => props.theme.container.spacing.small};
`;

export const PaginationInfoText = styled.span`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

export const PaginationButtons = styled.div`
    display: flex;
    gap: ${(props) => props.theme.container.spacing.xsmall};
`;

export const PageButton = styled.button<{ active?: boolean }>`
    min-width: 36px;
    height: 36px;
    padding: ${(props) => props.theme.container.spacing.xsmall}
        ${(props) => props.theme.container.spacing.small};
    background-color: ${(props) =>
        props.active
            ? props.theme.theme_colours[5]()
            : props.theme.container.background.colour.solid()};
    color: ${(props) =>
        props.active
            ? props.theme.text.colour.white()
            : props.theme.text.colour.primary()};
    border: 1px solid
        ${(props) =>
            props.active
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    cursor: pointer;
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) =>
        props.active
            ? props.theme.text.weight.bold
            : props.theme.text.weight.normal};
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.active
                ? props.theme.theme_colours[5](undefined, undefined, 40)
                : props.theme.container.background.colour.light_contrast()};
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }

    &:focus {
        outline: 2px solid ${(props) => props.theme.theme_colours[5]()};
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        min-width: 44px;
        height: 44px;
    }
`;

// ============================================================================
// PROFILE VIEW SPECIFIC STYLES
// ============================================================================

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
    padding: ${(props) => props.theme.container.spacing.medium};
    margin-bottom: ${(props) => props.theme.container.spacing.small};
    background: ${(props) =>
        props.selected
            ? props.theme.theme_colours[9]()
            : props.deleted
              ? props.theme.container.background.colour.light_contrast()
              : props.theme.container.background.colour.solid()};
    transition: all 0.2s ease;
    opacity: ${(props) => (props.deleted ? 0.7 : 1)};

    &:hover {
        border-color: ${(props) => props.theme.theme_colours[5]()};
        box-shadow: ${(props) => props.theme.container.shadow.box};
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

export const PostLink = styled.a`
    color: ${(props) => props.theme.text.colour.anchor()};
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    font-size: ${(props) => props.theme.text.size.small};
    margin-top: ${(props) => props.theme.container.spacing.small};
    padding: ${(props) => props.theme.container.spacing.xsmall}
        ${(props) => props.theme.container.spacing.small};
    border-radius: ${(props) => props.theme.container.border.radius};
    transition: all 0.2s ease;

    &:hover {
        text-decoration: underline;
        background-color: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
    }

    svg {
        flex-shrink: 0;
    }
`;

// ============================================================================
// LOAD MORE BUTTONS
// ============================================================================

export const LoadMoreButton = styled.button`
    display: block;
    width: 100%;
    padding: ${(props) => props.theme.container.spacing.medium};
    margin-top: ${(props) => props.theme.container.spacing.medium};
    background-color: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    color: ${(props) => props.theme.text.colour.anchor()};
    font-size: ${(props) => props.theme.text.size.normal};
    font-weight: ${(props) => props.theme.text.weight.medium};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background-color: ${(props) => props.theme.theme_colours[9]()};
        border-color: ${(props) => props.theme.theme_colours[5]()};
        color: ${(props) => props.theme.theme_colours[5]()};
    }

    &:focus {
        outline: 2px solid ${(props) => props.theme.theme_colours[5]()};
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const ContinueThreadButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    margin-top: ${(props) => props.theme.container.spacing.small};
    background: none;
    border: none;
    color: ${(props) => props.theme.text.colour.anchor()};
    font-size: ${(props) => props.theme.text.size.small};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        color: ${(props) =>
            props.theme.text.colour.anchor(undefined, undefined, 40)};
        text-decoration: underline;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    svg {
        transition: transform 0.2s ease;
    }

    &:hover svg {
        transform: translateX(4px);
    }
`;
