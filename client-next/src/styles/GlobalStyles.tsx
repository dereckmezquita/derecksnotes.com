import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
    ${reset}

    * {
        box-sizing: border-box;
    }

    html, body {
        height: 100vh;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: ${theme.text.font.primary};
        background-color: ${theme.container.background.colour.primary()};
        color: ${theme.text.colour.primary()};
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: ${theme.text.font.header};
        color: ${theme.text.colour.header()};
        text-align: left;
    }

    a {
        color: ${theme.text.colour.anchor()};
    }

    a:hover {
        color: ${theme.text.colour.anchor(undefined, 100, 0)};
    }
`;

export default GlobalStyles;