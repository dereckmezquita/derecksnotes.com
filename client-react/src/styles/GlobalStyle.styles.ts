import { createGlobalStyle } from 'styled-components';
import { linedGridBackground } from './theme';

export const GlobalStyle = createGlobalStyle`
    html {
        font-size: 1.1em;
        background: ${(props) => props.theme.backgrounds.background};

        ${linedGridBackground}

        // smooth scroll with an offset
        scroll-behavior: smooth;
        scroll-padding-top: 45px;

        // works in conjunction with @media .wrapper to dynamically resize the screen to be apt for mobile devices
        @media only screen and (max-width: 1024px) {
            font-size: 1.15em;
        }
    }

    body {
        margin: 0;
        padding: 0;

        // break lines but don't break words
        word-break: break-word;
        hyphens: none;
    }
`;