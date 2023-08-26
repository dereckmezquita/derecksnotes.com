import React from 'react';
import { AppProps } from 'next/app';
import GlobalStyles from '@styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';

import NavBar from '@components/ui/NavBar';

import { theme } from '@styles/theme';


export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={{ theme }}>
            <GlobalStyles />
            <NavBar />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}
