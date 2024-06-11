import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const h1_size: number = 2;

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

    @media only screen and (max-width: ${theme.container.widths.min_width_mobile}) {
        body {
            font-size: 1.2em;
        }
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: ${theme.text.font.header};
        color: ${theme.text.colour.header()};
        text-align: left;
    }

    h1 {
        font-size: ${h1_size}em;
        border-bottom: 1px solid ${theme.container.border.colour.primary()};
    }

    h2 {
        font-size: ${h1_size * 0.85}em;
    }

    h3 {
        font-size: ${h1_size * 0.65}em;
    }

    h4, h5, h6 {
        font-size: ${h1_size * 0.45}em;
    }


    a {
        color: ${theme.text.colour.anchor()};

        &:hover {
            color: ${theme.text.colour.anchor_hover()};
        }
    }

    embed {
        height: calc(40vw * 1.3);
        width: 40vw;

        display: block;
        margin: 20px auto;

        padding: 7px;

        /* background: $figure_background;
        border: 1px solid $figure_border;
        box-shadow: 1px 1px 7px $figure_shadow; */
    }
`;

export default GlobalStyles;
