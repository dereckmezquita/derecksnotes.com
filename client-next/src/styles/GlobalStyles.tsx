import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html, body {
        min-height: 100vh;
        margin: 0;
        padding: 0;

        scroll-behavior: smooth;
    }

    body {
        background-size: 12px 12px;
        background-image: linear-gradient(to right, rgb(240, 240, 240) 1px, transparent 1px), linear-gradient(to bottom, rgb(240, 240, 240) 1px, transparent 1px);

        background-color: ${theme.container.background.colour.primary()};

        font-family: ${theme.text.font.times};
        color: ${theme.text.colour.primary()};
        font-size: 1.15em;

        // break lines but don't break words
        word-break: break-word;
        hyphens: none;
    }

    @media only screen and (max-width: 1024px) {
        body {
            font-size: 1.2em;
        }
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