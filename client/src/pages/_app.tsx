import React from 'react';
import { AppProps } from 'next/app';

// components
import NavBar from '@components/ui/NavBar';
import Logo from '@components/ui/Logo';
import Footer from '@components/ui/Footer';

// styles
import GlobalStyles from '@styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from '@styles/theme';

import '@public/fonts/roboto.css'; // sans-serif
import '@public/fonts/tangerine.css'; // cursive
import '@public/fonts/fjalla_one.css'; // block letters; main logo

import '@styles/footnotes.css'; // markdown processed by @utils/markdown.ts
import useNextClickHandler from '@utils/useNextClickHandler'; // TODO: temp solution for handling internal links from markdown content


export default function App({ Component, pageProps, router }: AppProps) {
    useNextClickHandler(router)
    return (
        <ThemeProvider theme={ theme }>
            <GlobalStyles />
            <Logo />
            <NavBar />
            <Component {...pageProps} />
            <Footer />
        </ThemeProvider>
    )
}
