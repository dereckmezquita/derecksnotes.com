import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import Link from 'next/link';

const HeaderContainer = styled(Link)`
    padding-top: 20px;
    text-align: center;

    text-decoration: none;
    display: block;
    width: fit-content;
    margin: auto;
    color: black;
    text-shadow: -5px 5px 5px rgba(153, 153, 153, 0.5);
`;

const SiteEstablished = styled.span`
    font-family: "Tangerine", sans-serif;
    display: block;
    font-style: italic;
    font-size: 30px;
    line-height: 22.5px;
    color: black;
`;

const SiteSlogan = styled.span`
    font-size: 18px;
    display: block;
    text-transform: uppercase;
    transform: scale(0.955, 1);
    line-height: 27.5px;
    color: black;

    @media only screen and (max-width: 414px) {
        font-size: 16px;
    }

    @media only screen and (max-width: 370px) {
        font-size: 14px;
    }
`;

export const SiteName = styled.span`
    font-family: "Fjalla One", sans-serif;
    display: inline-block;
    text-transform: uppercase;
    color: ${theme.theme_colours[5]()};
    font-size: 42.5px;
    transform: scale(1.35, 1.3);
    line-height: 57px;
    text-shadow: -5px 5px 10px rgba(153, 153, 153, 0.4);

    &:hover {
        color: black;
    }

    @media only screen and (max-width: 370px) {
        font-size: 37px;
    }
`;

const Logo = () => (
    <HeaderContainer href='/' passHref>
        <SiteEstablished>Established France 2017</SiteEstablished>
        <SiteSlogan>The online brain of Dereck Mezquita</SiteSlogan>
        <SiteName>Dereck's Notes</SiteName>
    </HeaderContainer>
);

export default Logo;
