import styled from 'styled-components';
import { theme } from '@styles/theme';

import Button from '@components/atomic/Button';

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
`;

export const ModalContainer = styled.div`
    width: 450px;

    @media (max-width: 650px) {
        width: 95%;
    }

    margin: 0 auto;
    background-color: ${theme.container.background.colour.primary()};
    padding: 20px;
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${theme.container.shadow.box};
    color: ${theme.text.colour.primary()};
`;

export const InputField = styled.div`
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${theme.container.border.colour.primary()};
    padding-bottom: 5px;
    &:focus-within {
        border-bottom: 2px solid ${theme.theme_colours[5]()}; // Made it a little more pronounced
    }
`;

export const Input = styled.input`
    width: 100%;
    padding: 5px 5px 5px 10px; // added left padding
    font-family: ${theme.text.font.times};
    font-size: 1em;
    color: ${theme.text.colour.primary()};
    border: none;
    outline: none;
    background-color: transparent;
    &::placeholder {
        opacity: 0.7; // make placeholder slightly transparent
    }
`;

export const LinkButton = styled.a`
    display: inline-block;
    cursor: pointer;
    color: #333;
    &:hover {
        text-decoration: underline;
    }
`;

export const StyledForm = styled.form`
    margin-bottom: 20px;
`;

export const StyledButton = styled(Button)`
    margin-top: 10px; // spacing from the input fields
`;
