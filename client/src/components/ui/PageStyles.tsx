import styled from 'styled-components';

export const PageContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: ${(p) => p.theme.container.spacing.large}
        ${(p) => p.theme.container.spacing.medium};
`;

export const PageTitle = styled.h1`
    font-family: ${(p) => p.theme.text.font.header};
    color: ${(p) => p.theme.text.colour.header()};
    font-size: ${(p) => p.theme.text.size.xlarge};
    margin: 0 0 ${(p) => p.theme.container.spacing.large} 0;
`;

export const Card = styled.div`
    border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    border-radius: ${(p) => p.theme.container.border.radius};
    background: ${(p) => p.theme.container.background.colour.card()};
    padding: ${(p) => p.theme.container.spacing.medium};
    margin-bottom: ${(p) => p.theme.container.spacing.medium};
`;

export const CardTitle = styled.h2`
    font-family: ${(p) => p.theme.text.font.header};
    color: ${(p) => p.theme.text.colour.header()};
    font-size: ${(p) => p.theme.text.size.medium};
    margin: 0 0 ${(p) => p.theme.container.spacing.small} 0;
`;

export const Label = styled.label`
    display: block;
    font-size: ${(p) => p.theme.text.size.small};
    color: ${(p) => p.theme.text.colour.light_grey()};
    margin-bottom: 2px;
`;

export const Input = styled.input`
    width: 100%;
    padding: ${(p) => p.theme.container.spacing.small};
    border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    border-radius: ${(p) => p.theme.container.border.radius};
    font-family: ${(p) => p.theme.text.font.roboto};
    font-size: ${(p) => p.theme.text.size.normal};
    margin-bottom: ${(p) => p.theme.container.spacing.small};
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${(p) => p.theme.text.colour.header()};
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 80px;
    padding: ${(p) => p.theme.container.spacing.small};
    border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    border-radius: ${(p) => p.theme.container.border.radius};
    font-family: ${(p) => p.theme.text.font.roboto};
    font-size: ${(p) => p.theme.text.size.normal};
    resize: vertical;
    margin-bottom: ${(p) => p.theme.container.spacing.small};
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${(p) => p.theme.text.colour.header()};
    }
`;

export const Button = styled.button<{
    $variant?: 'primary' | 'secondary' | 'danger';
}>`
    padding: ${(p) => p.theme.container.spacing.small}
        ${(p) => p.theme.container.spacing.medium};
    border-radius: ${(p) => p.theme.container.border.radius};
    font-family: ${(p) => p.theme.text.font.roboto};
    font-size: ${(p) => p.theme.text.size.small};
    font-weight: ${(p) => p.theme.text.weight.bold};
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    background: ${(p) => {
        if (p.$variant === 'danger') return p.theme.colours.error;
        if (p.$variant === 'secondary') return 'transparent';
        return p.theme.text.colour.header();
    }};
    color: ${(p) =>
        p.$variant === 'secondary'
            ? p.theme.text.colour.light_grey()
            : 'white'};
    border: ${(p) =>
        p.$variant === 'secondary'
            ? `1px solid ${p.theme.container.border.colour.primary()}`
            : 'none'};

    &:hover {
        opacity: 0.9;
    }
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const ButtonRow = styled.div`
    display: flex;
    gap: ${(p) => p.theme.container.spacing.small};
    margin-top: ${(p) => p.theme.container.spacing.small};
`;

export const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${(p) => p.theme.container.spacing.small} 0;
    border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    font-size: ${(p) => p.theme.text.size.small};

    &:last-child {
        border-bottom: none;
    }
`;

export const InfoLabel = styled.span`
    color: ${(p) => p.theme.text.colour.light_grey()};
`;

export const InfoValue = styled.span`
    color: ${(p) => p.theme.text.colour.primary()};
    font-weight: ${(p) => p.theme.text.weight.medium};
`;

export const Avatar = styled.div<{ $size?: number }>`
    width: ${(p) => p.$size || 64}px;
    height: ${(p) => p.$size || 64}px;
    border-radius: 50%;
    background: ${(p) => p.theme.container.background.colour.light_contrast()};
    border: 2px solid ${(p) => p.theme.container.border.colour.primary()};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(p) => (p.$size || 64) / 2.5}px;
    font-weight: ${(p) => p.theme.text.weight.bold};
    color: ${(p) => p.theme.text.colour.header()};
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const ProfileHeader = styled.div`
    display: flex;
    gap: ${(p) => p.theme.container.spacing.medium};
    align-items: flex-start;
    margin-bottom: ${(p) => p.theme.container.spacing.medium};
`;

export const ProfileInfo = styled.div`
    flex: 1;
`;

export const Username = styled.h2`
    margin: 0;
    font-family: ${(p) => p.theme.text.font.header};
    color: ${(p) => p.theme.text.colour.header()};
    font-size: ${(p) => p.theme.text.size.large};
`;

export const DisplayName = styled.p`
    margin: 2px 0 0 0;
    color: ${(p) => p.theme.text.colour.primary()};
    font-weight: ${(p) => p.theme.text.weight.medium};
`;

export const Bio = styled.p`
    margin: ${(p) => p.theme.container.spacing.small} 0 0 0;
    color: ${(p) => p.theme.text.colour.primary()};
    line-height: 1.5;
`;

export const JoinDate = styled.p`
    margin: 4px 0 0 0;
    font-size: ${(p) => p.theme.text.size.small};
    color: ${(p) => p.theme.text.colour.light_grey()};
`;

export const EmptyState = styled.p`
    color: ${(p) => p.theme.text.colour.light_grey()};
    font-style: italic;
    text-align: center;
    padding: ${(p) => p.theme.container.spacing.medium} 0;
`;

export const SuccessMessage = styled.p`
    color: ${(p) => p.theme.colours.success};
    font-size: ${(p) => p.theme.text.size.small};
    margin: 4px 0;
`;

export const ErrorMessage = styled.p`
    color: ${(p) => p.theme.colours.error};
    font-size: ${(p) => p.theme.text.size.small};
    margin: 4px 0;
`;

export const TabBar = styled.div`
    display: flex;
    border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    margin-bottom: ${(p) => p.theme.container.spacing.medium};
    gap: 0;
`;

export const Tab = styled.button<{ $active: boolean }>`
    padding: ${(p) => p.theme.container.spacing.small}
        ${(p) => p.theme.container.spacing.medium};
    background: none;
    border: none;
    border-bottom: 2px solid
        ${(p) => (p.$active ? p.theme.text.colour.header() : 'transparent')};
    color: ${(p) =>
        p.$active
            ? p.theme.text.colour.header()
            : p.theme.text.colour.light_grey()};
    font-family: ${(p) => p.theme.text.font.roboto};
    font-size: ${(p) => p.theme.text.size.small};
    font-weight: ${(p) =>
        p.$active ? p.theme.text.weight.bold : p.theme.text.weight.normal};
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:hover {
        color: ${(p) => p.theme.text.colour.header()};
    }
`;
