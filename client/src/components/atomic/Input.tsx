import styled from 'styled-components';
import { theme } from '@styles/theme';

const Input = styled.input`
    width: 100%;

    padding: 7px;
    margin-bottom: 10px;

    background-color: ${theme.container.background.colour.primary()};
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    display: flex;
    align-items: center;
`;

export default Input;
