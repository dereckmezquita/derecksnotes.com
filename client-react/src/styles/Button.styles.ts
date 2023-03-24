import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    backgroundColor?: string;
    color?: string;
    hoverBackgroundColor?: string;
}

export const ButtonWrapper = styled.button<ButtonProps>`
    background-color: ${props => props.backgroundColor || 'white'};
    color: ${props => props.color || 'black'};
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.hoverBackgroundColor || 'lightgray'};
    }
`;
