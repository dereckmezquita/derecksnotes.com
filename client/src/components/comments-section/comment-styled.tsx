import styled from 'styled-components';
import { theme } from '@styles/theme';

export const CommentContainer = styled.div`
    position: relative;
    background-color: ${theme.container.background.colour.primary()};
    padding: 10px 5px 10px 15px;
    margin-bottom: 15px;
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${theme.container.shadow.box};
    &:hover {
        box-shadow: ${theme.container.shadow.primary};
    }
`;

export const CommentHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

export const UserProfile = styled.div`
    display: flex;
    align-items: center;
`;

export const ProfileImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    border: 1px solid ${theme.container.border.colour.primary()};
`;

export const Username = styled.span<{ currentUser: boolean }>`
    font-weight: bold;
    font-family: ${theme.text.font.times};
    color: ${props => props.currentUser ? 'hsl(205, 70%, 50%)' : theme.text.colour.header()};
`;

export const CommentText = styled.p`
    font-family: ${theme.text.font.times};
    font-size: 0.9em;
    margin-bottom: 10px;
    overflow: hidden;
`;

export const RepliesContainer = styled.div`
    position: relative;
    margin-top: 15px;
    margin-left: 15px;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: -10px;
        width: 2px;
        height: 100%;
        background-color: ${theme.container.border.colour.primary()};
    }
`;

export const ActionsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const ActionButton = styled.button`
    background-color: transparent;
    border: none;
    font-family: ${theme.text.font.times};
    font-size: 0.8em;
    cursor: pointer;
    color: hsl(0, 0%, 70%);
    &:hover {
        color: hsl(205, 70%, 50%);
        text-decoration: underline;
    }
`;

export const DateContainer = styled.div`
    position: relative;
    cursor: pointer;
    color: ${theme.text.colour.light_grey()};
`;

export const CreatedAtDate = styled.span`
    font-size: 0.7em;
    font-family: ${theme.text.font.times};
`;

export const UpdatedAtDate = styled.span`
    font-size: 0.8em;
    font-family: ${theme.text.font.times};
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    background-color: #fff; // Background color to ensure text readability
    border: 1px solid ${theme.container.border.colour.primary()};
    padding: 2px 5px;
    border-radius: 4px;
    z-index: 10;
    
    ${DateContainer}:hover & {
        opacity: 1;
    }
`;