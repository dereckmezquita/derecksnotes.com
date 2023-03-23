import React from 'react';
import styled from 'styled-components';
import Head from './components/base/Head';
import InfoBar from './components/base/InfoBar';
import Header from './components/base/Header';
import Nav from './components/base/Nav';
import Footer from './components/base/Footer';

import CardList from './components/articles/CardList';

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
                {/* pass "blog" to CardList */}
                <CardList siteSection="blog" />
            </Wrapper>
            <Footer />
        </PageContainer>
    );
};

export default App;
