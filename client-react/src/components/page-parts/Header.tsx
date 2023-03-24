import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  /* Add styles for header */
`;

const Header: React.FC = () => {
    return (
        <HeaderContainer>
            <a href="/index.html" className="home-page-link">
                <span id="header-established">Established France 2017</span>
                <span id="header-slogan">
                    The online brain of Dereck <span id="header-author-particule">de </span>Mezquita
                </span>
                <span className="header-site-name">Dereck's Notes</span>
            </a>
        </HeaderContainer>
    );
};

export default Header;