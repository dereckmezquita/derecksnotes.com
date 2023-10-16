import styled from 'styled-components';
import { theme } from '@styles/theme';

const DropCap = styled.span<{ fontSize?: string }>`
    float: left;
    font-size: ${props => props.fontSize ? props.fontSize : '4.75em'};
    font-family: Georgia, serif;
    line-height: 40px;
    margin-right: 0.1em;
    color: ${theme.theme_colours[5]()};
`;

export default DropCap;