'use client';

import styled, { css, keyframes } from 'styled-components';
import { Article } from '@components/pages/posts-dictionaries';

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

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

// ============================================================================
// LAYOUT
// ============================================================================

// AdminMain extends Article to maintain consistent styling with the rest of the site
export const AdminMain = styled(Article)`
    width: 75%;
    text-align: left;

    @media (max-width: 900px) {
        width: 100%;
        border-left: none;
    }
`;

export const AdminHeader = styled.div`
    margin-bottom: ${(props) => props.theme.container.spacing.large};
`;

export const AdminTitle = styled.h1`
    margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
    color: ${(props) => props.theme.text.colour.header()};
    font-size: ${(props) => props.theme.text.size.xlarge};
    font-weight: ${(props) => props.theme.text.weight.bold};
`;

export const AdminSubtitle = styled.p`
    margin: 0;
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: ${(props) => props.theme.text.size.normal};
`;

// ============================================================================
// SIDEBAR NAVIGATION
// ============================================================================

export const SidebarTitle = styled.h2`
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) => props.theme.text.weight.bold};
    color: ${(props) => props.theme.text.colour.light_grey()};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
    padding: 0 ${(props) => props.theme.container.spacing.small};
`;

export const SidebarNav = styled.nav`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.container.spacing.xsmall};
`;

export const SidebarLink = styled.a<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    border-radius: ${(props) => props.theme.container.border.radius};
    color: ${(props) =>
        props.$active
            ? props.theme.theme_colours[5]()
            : props.theme.text.colour.primary()};
    background: ${(props) =>
        props.$active ? props.theme.theme_colours[9]() : 'transparent'};
    text-decoration: none;
    font-weight: ${(props) =>
        props.$active
            ? props.theme.text.weight.medium
            : props.theme.text.weight.normal};
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        background: ${(props) =>
            props.$active
                ? props.theme.theme_colours[9]()
                : props.theme.container.background.colour.light_contrast()};
        color: ${(props) => props.theme.theme_colours[5]()};
    }

    svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
    }
`;

export const SidebarDivider = styled.hr`
    border: none;
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    margin: ${(props) => props.theme.container.spacing.medium} 0;
`;

// ============================================================================
// CARDS & CONTAINERS
// ============================================================================

export const Card = styled.div`
    background: ${(props) => props.theme.container.background.colour.solid()};
    border-radius: ${(props) => props.theme.container.border.radius};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    box-shadow: ${(props) => props.theme.container.shadow.box};
    padding: ${(props) => props.theme.container.spacing.large};
    animation: ${fadeIn} 0.3s ease;
`;

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
    padding-bottom: ${(props) => props.theme.container.spacing.small};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

export const CardTitle = styled.h2`
    margin: 0;
    color: ${(props) => props.theme.text.colour.header()};
    font-size: ${(props) => props.theme.text.size.large};
    font-weight: ${(props) => props.theme.text.weight.bold};
`;

// ============================================================================
// STATS CARDS
// ============================================================================

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${(props) => props.theme.container.spacing.medium};
    margin-bottom: ${(props) => props.theme.container.spacing.large};
`;

export const StatCard = styled.div`
    background: ${(props) => props.theme.container.background.colour.solid()};
    border-radius: ${(props) => props.theme.container.border.radius};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding: ${(props) => props.theme.container.spacing.large};
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.container.spacing.small};
    transition: all 0.2s ease;

    &:hover {
        border-color: ${(props) => props.theme.theme_colours[5]()};
        box-shadow: ${(props) => props.theme.container.shadow.box};
    }
`;

export const StatValue = styled.div`
    font-size: 2rem;
    font-weight: ${(props) => props.theme.text.weight.bold};
    color: ${(props) => props.theme.text.colour.header()};
`;

export const StatLabel = styled.div`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

export const StatIcon = styled.div<{
    $variant?: 'primary' | 'warning' | 'success' | 'danger';
}>`
    width: 40px;
    height: 40px;
    border-radius: ${(props) => props.theme.container.border.radius};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${(props) => props.theme.container.spacing.small};

    ${(props) => {
        switch (props.$variant) {
            case 'warning':
                return css`
                    background: ${props.theme.colours.warning}20;
                    color: ${props.theme.colours.warning};
                `;
            case 'success':
                return css`
                    background: ${props.theme.colours.success}20;
                    color: ${props.theme.colours.success};
                `;
            case 'danger':
                return css`
                    background: ${props.theme.colours.error}20;
                    color: ${props.theme.colours.error};
                `;
            default:
                return css`
                    background: ${props.theme.theme_colours[9]()};
                    color: ${props.theme.theme_colours[5]()};
                `;
        }
    }}

    svg {
        width: 20px;
        height: 20px;
    }
`;

// ============================================================================
// TABLES - Spreadsheet-like design
// ============================================================================

export const TableContainer = styled.div`
    overflow-x: auto;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
`;

export const TableHead = styled.thead`
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    position: sticky;
    top: 0;
    z-index: 1;
`;

export const TableBody = styled.tbody`
    & > tr:nth-child(even) {
        background: ${(props) =>
            props.theme.container.background.colour.light_contrast()}50;
    }
`;

export const TableRow = styled.tr`
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: ${(props) => props.theme.theme_colours[9]()}40;
    }
`;

export const TableHeader = styled.th<{
    $width?: string;
    $align?: 'left' | 'center' | 'right';
}>`
    padding: 10px 12px;
    text-align: ${(props) => props.$align || 'left'};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: 0.75rem;
    color: ${(props) => props.theme.text.colour.primary()};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    border-right: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    ${(props) => props.$width && `width: ${props.$width};`}

    &:last-child {
        border-right: none;
    }
`;

export const TableCell = styled.td<{
    $align?: 'left' | 'center' | 'right';
    $truncate?: boolean;
}>`
    padding: 10px 12px;
    font-size: 0.875rem;
    color: ${(props) => props.theme.text.colour.primary()};
    vertical-align: middle;
    text-align: ${(props) => props.$align || 'left'};
    border-right: 1px solid
        ${(props) => props.theme.container.border.colour.primary()}50;

    ${(props) =>
        props.$truncate &&
        css`
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `}

    &:last-child {
        border-right: none;
    }
`;

export const TableFooter = styled.tfoot`
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-top: 2px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

export const TableCaption = styled.caption`
    padding: 12px;
    font-size: 0.875rem;
    color: ${(props) => props.theme.text.colour.light_grey()};
    text-align: left;
    caption-side: bottom;
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

// ============================================================================
// BUTTONS
// ============================================================================

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large';
}

const getButtonColor = (variant: string, theme: any) => {
    switch (variant) {
        case 'secondary':
            return theme.container.border.colour.primary();
        case 'danger':
            return theme.colours.error;
        case 'success':
            return theme.colours.success;
        case 'warning':
            return theme.colours.warning;
        default:
            return theme.theme_colours[5]();
    }
};

export const Button = styled.button<ButtonProps>`
    padding: ${(props) =>
        props.size === 'small'
            ? '6px 12px'
            : props.size === 'large'
              ? '12px 24px'
              : '8px 16px'};
    background: ${(props) =>
        getButtonColor(props.variant || 'primary', props.theme)};
    color: ${(props) =>
        props.variant === 'secondary'
            ? props.theme.text.colour.primary()
            : '#fff'};
    border: none;
    border-radius: ${(props) => props.theme.container.border.radius};
    font-weight: ${(props) => props.theme.text.weight.medium};
    font-size: ${(props) =>
        props.size === 'small'
            ? props.theme.text.size.small
            : props.theme.text.size.normal};
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};

    &:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: ${(props) => props.theme.container.spacing.small};
    flex-wrap: wrap;
`;

export const IconButton = styled.button<{
    $variant?: 'primary' | 'danger' | 'success';
}>`
    width: 32px;
    height: 32px;
    border-radius: ${(props) => props.theme.container.border.radius};
    border: none;
    background: ${(props) =>
        props.$variant === 'danger'
            ? `${props.theme.colours.error}20`
            : props.$variant === 'success'
              ? `${props.theme.colours.success}20`
              : props.theme.container.background.colour.light_contrast()};
    color: ${(props) =>
        props.$variant === 'danger'
            ? props.theme.colours.error
            : props.$variant === 'success'
              ? props.theme.colours.success
              : props.theme.text.colour.primary()};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        opacity: 0.8;
        transform: scale(1.05);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    svg {
        width: 16px;
        height: 16px;
    }
`;

// ============================================================================
// BADGES
// ============================================================================

export const Badge = styled.span<{
    $variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}>`
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: ${(props) => props.theme.text.weight.medium};

    ${(props) => {
        switch (props.$variant) {
            case 'success':
                return css`
                    background: ${props.theme.colours.success}20;
                    color: ${props.theme.colours.success};
                `;
            case 'warning':
                return css`
                    background: ${props.theme.colours.warning}20;
                    color: ${props.theme.colours.warning};
                `;
            case 'danger':
                return css`
                    background: ${props.theme.colours.error}20;
                    color: ${props.theme.colours.error};
                `;
            case 'secondary':
                return css`
                    background: ${props.theme.container.background.colour.light_contrast()};
                    color: ${props.theme.text.colour.light_grey()};
                `;
            default:
                return css`
                    background: ${props.theme.theme_colours[9]()};
                    color: ${props.theme.theme_colours[5]()};
                `;
        }
    }}
`;

// ============================================================================
// FORMS
// ============================================================================

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
`;

export const Label = styled.label`
    font-weight: ${(props) => props.theme.text.weight.medium};
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.primary()};
`;

export const Input = styled.input`
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    font-size: ${(props) => props.theme.text.size.normal};
    color: ${(props) => props.theme.text.colour.primary()};
    background: ${(props) => props.theme.container.background.colour.solid()};
    transition: all 0.2s ease;

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

    &::placeholder {
        color: ${(props) => props.theme.text.colour.light_grey()};
    }
`;

export const SearchInput = styled(Input)`
    width: 100%;
    max-width: 300px;
    padding-left: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 12px center;
`;

export const Select = styled.select`
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    font-size: ${(props) => props.theme.text.size.normal};
    color: ${(props) => props.theme.text.colour.primary()};
    background: ${(props) => props.theme.container.background.colour.solid()};
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

// ============================================================================
// LOADING & EMPTY STATES
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

export const EmptyState = styled.div`
    text-align: center;
    padding: ${(props) => props.theme.container.spacing.xlarge};
    color: ${(props) => props.theme.text.colour.light_grey()};

    svg {
        width: 48px;
        height: 48px;
        margin-bottom: ${(props) => props.theme.container.spacing.medium};
        opacity: 0.5;
    }

    h3 {
        margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
        color: ${(props) => props.theme.text.colour.header()};
    }

    p {
        margin: 0;
    }
`;

// ============================================================================
// MODALS
// ============================================================================

export const ModalBackdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: ${(props) => props.theme.container.spacing.medium};
    animation: ${fadeIn} 0.2s ease;
`;

export const ModalContent = styled.div`
    background: ${(props) => props.theme.container.background.colour.solid()};
    border-radius: ${(props) => props.theme.container.border.radius};
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => props.theme.container.spacing.large};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

export const ModalTitle = styled.h3`
    margin: 0;
    color: ${(props) => props.theme.text.colour.header()};
    font-size: ${(props) => props.theme.text.size.large};
`;

export const ModalBody = styled.div`
    padding: ${(props) => props.theme.container.spacing.large};
`;

export const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${(props) => props.theme.container.spacing.small};
    padding: ${(props) => props.theme.container.spacing.large};
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: ${(props) => props.theme.container.border.radius};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${(props) => props.theme.text.colour.light_grey()};
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        color: ${(props) => props.theme.text.colour.primary()};
    }
`;

// ============================================================================
// ALERTS
// ============================================================================

export const Alert = styled.div<{
    $variant: 'error' | 'success' | 'warning' | 'info';
}>`
    padding: ${(props) => props.theme.container.spacing.medium};
    border-radius: ${(props) => props.theme.container.border.radius};
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};

    ${(props) => {
        switch (props.$variant) {
            case 'error':
                return css`
                    background: ${props.theme.colours.error}15;
                    border: 1px solid ${props.theme.colours.error}40;
                    color: ${props.theme.colours.error};
                `;
            case 'success':
                return css`
                    background: ${props.theme.colours.success}15;
                    border: 1px solid ${props.theme.colours.success}40;
                    color: ${props.theme.colours.success};
                `;
            case 'warning':
                return css`
                    background: ${props.theme.colours.warning}15;
                    border: 1px solid ${props.theme.colours.warning}40;
                    color: ${props.theme.colours.warning};
                `;
            default:
                return css`
                    background: ${props.theme.theme_colours[9]()};
                    border: 1px solid ${props.theme.theme_colours[5]()}40;
                    color: ${props.theme.theme_colours[5]()};
                `;
        }
    }}
`;

// ============================================================================
// ACCESS DENIED
// ============================================================================

export const AccessDenied = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    padding: ${(props) => props.theme.container.spacing.xlarge};

    svg {
        width: 64px;
        height: 64px;
        color: ${(props) => props.theme.colours.error};
        margin-bottom: ${(props) => props.theme.container.spacing.large};
    }

    h1 {
        margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
        color: ${(props) => props.theme.text.colour.header()};
    }

    p {
        margin: 0 0 ${(props) => props.theme.container.spacing.large} 0;
        color: ${(props) => props.theme.text.colour.light_grey()};
    }
`;

// ============================================================================
// PAGINATION
// ============================================================================

export const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    margin-top: ${(props) => props.theme.container.spacing.large};
`;

export const PageButton = styled.button<{ $active?: boolean }>`
    min-width: 36px;
    height: 36px;
    padding: 0 ${(props) => props.theme.container.spacing.small};
    border-radius: ${(props) => props.theme.container.border.radius};
    border: 1px solid
        ${(props) =>
            props.$active
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    background: ${(props) =>
        props.$active
            ? props.theme.theme_colours[5]()
            : props.theme.container.background.colour.solid()};
    color: ${(props) =>
        props.$active ? '#fff' : props.theme.text.colour.primary()};
    font-weight: ${(props) =>
        props.$active
            ? props.theme.text.weight.bold
            : props.theme.text.weight.normal};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

// ============================================================================
// ACTION BAR
// ============================================================================

export const ActionBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
    flex-wrap: wrap;
    gap: ${(props) => props.theme.container.spacing.small};
`;

export const ActionBarLeft = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.medium};
`;

export const ActionBarRight = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: ${(props) => props.theme.theme_colours[5]()};
`;

// ============================================================================
// ATTENTION SECTION (Notebook-style task list)
// ============================================================================

export const AttentionSection = styled.div`
    background: ${(props) => props.theme.container.background.colour.solid()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-left: 3px solid ${(props) => props.theme.theme_colours[5]()};
    border-radius: ${(props) => props.theme.container.border.radius};
    margin-bottom: ${(props) => props.theme.container.spacing.large};
    overflow: hidden;
`;

export const AttentionHeader = styled.div`
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) => props.theme.text.weight.bold};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

export const AttentionItem = styled.div<{ $variant?: 'warning' | 'danger' }>`
    display: flex;
    align-items: center;
    padding: ${(props) => props.theme.container.spacing.medium};
    border-bottom: 1px dashed
        ${(props) => props.theme.container.border.colour.primary()};
    transition: background 0.15s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: ${(props) => props.theme.theme_colours[9]()}30;
    }
`;

export const AttentionIcon = styled.div<{ $variant?: 'warning' | 'danger' }>`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${(props) => props.theme.container.spacing.medium};
    flex-shrink: 0;

    ${(props) => {
        switch (props.$variant) {
            case 'danger':
                return css`
                    background: ${props.theme.colours.error}15;
                    color: ${props.theme.colours.error};
                `;
            case 'warning':
            default:
                return css`
                    background: ${props.theme.colours.warning}15;
                    color: ${props.theme.colours.warning};
                `;
        }
    }}

    svg {
        width: 16px;
        height: 16px;
    }
`;

export const AttentionText = styled.div`
    flex: 1;
    font-size: ${(props) => props.theme.text.size.normal};
    color: ${(props) => props.theme.text.colour.primary()};
`;

export const AttentionCount = styled.span`
    font-weight: ${(props) => props.theme.text.weight.bold};
    color: ${(props) => props.theme.text.colour.header()};
`;

export const AttentionLink = styled.a`
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    padding: ${(props) => props.theme.container.spacing.xsmall}
        ${(props) => props.theme.container.spacing.small};
    margin-left: ${(props) => props.theme.container.spacing.medium};
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) => props.theme.text.weight.medium};
    color: ${(props) => props.theme.theme_colours[5]()};
    text-decoration: none;
    border-radius: ${(props) => props.theme.container.border.radius};
    transition: all 0.15s ease;

    &:hover {
        background: ${(props) => props.theme.theme_colours[9]()};
    }

    svg {
        width: 14px;
        height: 14px;
    }
`;

export const AttentionEmpty = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
    padding: ${(props) => props.theme.container.spacing.medium};
    color: ${(props) => props.theme.colours.success};
    font-size: ${(props) => props.theme.text.size.normal};

    svg {
        width: 20px;
        height: 20px;
    }
`;

// ============================================================================
// SITE OVERVIEW (Inline stats with divider)
// ============================================================================

export const SiteOverviewSection = styled.div`
    margin-bottom: ${(props) => props.theme.container.spacing.large};
`;

export const SiteOverviewDivider = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.medium};
    margin-bottom: ${(props) => props.theme.container.spacing.small};

    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: ${(props) => props.theme.container.border.colour.primary()};
    }

    span {
        font-size: ${(props) => props.theme.text.size.small};
        font-weight: ${(props) => props.theme.text.weight.medium};
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: ${(props) => props.theme.text.colour.light_grey()};
        white-space: nowrap;
    }
`;

export const InlineStats = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${(props) => props.theme.container.spacing.medium};
    font-size: ${(props) => props.theme.text.size.normal};
    color: ${(props) => props.theme.text.colour.primary()};
`;

export const InlineStat = styled.a`
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
    color: ${(props) => props.theme.text.colour.primary()};
    text-decoration: none;
    transition: color 0.15s ease;

    strong {
        color: ${(props) => props.theme.text.colour.header()};
    }

    &:hover {
        color: ${(props) => props.theme.theme_colours[5]()};

        strong {
            color: ${(props) => props.theme.theme_colours[5]()};
        }
    }
`;

export const StatSeparator = styled.span`
    color: ${(props) => props.theme.container.border.colour.primary()};
`;
