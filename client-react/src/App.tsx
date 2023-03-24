import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

import Head from './components/page-parts/Head';
import InfoBar from './components/page-parts/InfoBar';
import Header from './components/page-parts/Header';
import Nav from './components/page-parts/Nav';
import Footer from './components/page-parts/Footer';
import CardList from './components/articles/CardList';

import { GlobalStyle } from './styles/GlobalStyle.styles';

const PageContainer = styled.div`
    /* Add any global styles */
`;

const Wrapper = styled.div`
    /* Add styles for .wrapper */
`;

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <PageContainer>
                <Head />
                <InfoBar />
                <Header />
                <Nav />
                <Wrapper>
                    <CardList siteSection="blog" />
                </Wrapper>
                <Footer />
            </PageContainer>
        </ThemeProvider>
    );
};

export default App;
