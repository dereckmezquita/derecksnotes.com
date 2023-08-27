// src/components/Card.tsx
import styled from 'styled-components';

const Card = styled.div`
    border: 1px solid #ccc;
    background-color: ${(props) => props.theme.container.background.colour.primary()};

    padding: 15px;
    text-decoration: none;
    cursor: pointer;

    border-radius: 5px;
    box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5), 0 0 20px rgba(100, 100, 40, 0.2) inset;
    text-align: center;

    &:hover {
        box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.8), 0 0 20px rgba(100, 100, 40, 0.2) inset;
    }
`;

export default Card;
