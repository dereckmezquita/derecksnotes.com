import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from '@store/store';
import { fetchUserData } from '@store/userThunks';

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

import { REFRESH_STORE_DATA_INTERVAL } from '@constants/config';

/**
 * AppBody component contains the primary layout and Redux-dependent logic.
 * It should be used inside the Redux Provider to ensure access to the Redux store.
*/
function AppBody({ Component, pageProps }: { Component: React.ComponentType<any>, pageProps: any }) {
    // Using the useDispatch hook here since this component is rendered inside the Redux Provider.
    const dispatch = useDispatch<AppDispatch>();

    // Dispatching an action to fetch user data when the component mounts.
    useEffect(() => {
        dispatch(fetchUserData()); // Fetch user data immediately when the component mounts
    
        const intervalId = setInterval(() => {
            dispatch(fetchUserData());
        }, REFRESH_STORE_DATA_INTERVAL);
    
        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [dispatch]);    

    return (
        <>
            <GlobalStyles />
            <Logo />
            <NavBar />
            <Component {...pageProps} />
            <Footer />
        </>
    );
}

/**
 * The main App component is responsible for setting up the global providers.
 * It wraps the entire application with both the Theme and Redux providers.
*/
export default function App({ Component, pageProps, router }: AppProps) {
    // Handling internal link clicks (e.g., links within markdown content).
    useNextClickHandler(router);

    return (
        <ThemeProvider theme={theme}>
            {/* Wrapping the entire app with the Redux store provider. */}
            <Provider store={store}>
                {/* AppBody is nested inside the Provider to ensure it has access to the Redux context. */}
                <AppBody Component={Component} pageProps={pageProps} />
            </Provider>
        </ThemeProvider>
    );
}