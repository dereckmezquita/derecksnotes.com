import React from 'react';
import styled from 'styled-components';
import Head from './components/Head';
import InfoBar from './components/InfoBar';
import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';

const PageContainer = styled.div`
  /* Add any global styles */
`;

const Wrapper = styled.div`
  /* Add styles for .wrapper */
`;

const CardArticles = styled.div`
  /* Add styles for .card-articles */
`;

const SiteSection = styled.input`
  /* Add styles for #siteSection */
`;

const App: React.FC = () => {
    return (
        <PageContainer>
            <Head />
            <InfoBar />
            <Header />
            <Nav />
            <Wrapper>
                <CardArticles>{/* Cards will load here */}</CardArticles>
            </Wrapper>
            <SiteSection hidden type="text" id="siteSection" value="blog" />
            <Footer />
        </PageContainer>
    );
};

export default App;
