'use client';

import styled from 'styled-components';
import { TableRow } from '../../components/AdminStyles';

// Re-export common components from AdminStyles for convenience
export {
    TabContainer,
    Tab,
    DetailRow,
    DetailLabel,
    DetailValue,
    FilterGroup,
    FilterLabel,
    DateTimeInput,
    CodeBlock,
    MonoText,
    TextButton,
    WideModalContent
} from '../../components/AdminStyles';

// ============================================================================
// LOGS-SPECIFIC STYLES
// ============================================================================

export const LogMessage = styled.div`
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 0.8rem;
    white-space: pre-wrap;
    word-break: break-word;
    max-width: 400px;
`;

export const StackTrace = styled.pre`
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 0.7rem;
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    padding: ${(props) => props.theme.container.spacing.small};
    border-radius: ${(props) => props.theme.container.border.radius};
    overflow-x: auto;
    max-height: 200px;
    white-space: pre-wrap;
    word-break: break-word;
    margin-top: ${(props) => props.theme.container.spacing.xsmall};
`;

export const ClearedRow = styled(TableRow)<{ $isCleared: boolean }>`
    opacity: ${(props) => (props.$isCleared ? 0.5 : 1)};
    background: ${(props) =>
        props.$isCleared
            ? props.theme.container.background.colour.light_contrast()
            : 'inherit'};
`;

export const NotesInput = styled.textarea`
    width: 100%;
    padding: ${(props) => props.theme.container.spacing.small};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    background: ${(props) => props.theme.container.background.colour.solid()};
    color: ${(props) => props.theme.text.colour.primary()};
    font-family: inherit;
    font-size: 0.9rem;
    resize: vertical;
    min-height: 80px;
    margin-top: ${(props) => props.theme.container.spacing.xsmall};

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

export const ViewButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.theme_colours[5]()};
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0;
    text-decoration: underline;

    &:hover {
        opacity: 0.8;
    }
`;
