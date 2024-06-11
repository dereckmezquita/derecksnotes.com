import styled from 'styled-components';

const Button = styled.button`
    padding: 5px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: hsl(205, 70%, 50%);
    color: white;

    &:hover {
        background-color: hsl(205, 100%, 30%);
    }
`;

export default Button;
