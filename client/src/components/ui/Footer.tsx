import styled from 'styled-components';
import { config } from '@lib/env';
import Link from 'next/link';
import { ReactElement } from 'react';

const minWidthSnapUp = (props: any) =>
    props.theme.container.widths.min_width_snap_up;

const FooterContainer = styled.footer`
    margin: 0px auto;
    margin-top: 30px;
    padding: 0px;
    text-align: center;
    border-top: ${(props) =>
        `1px solid ${props.theme.text.colour.light_grey()}`};

    width: 50%;

    @media (max-width: ${minWidthSnapUp}) {
        width: 85%;
    }
`;

const FooterText = styled.p`
    font-size: 0.85rem;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

function getCurrentYear(): number {
    return new Date().getFullYear();
}

function Footer(): ReactElement {
    return (
        <FooterContainer>
            <FooterText>
                All content on this website is copyright protected and belongs
                to Dereck Mezquita. You are not allowed to copy nor modify any
                content found on this website without written permission from
                the owner; Copyright © 2017 - {getCurrentYear()}
            </FooterText>
            <FooterText>
                Application build: {config.buildEnv}, Application version:{' '}
                {config.version}, test API integration:{' '}
                <Link href="/test/api">/test/api</Link>
            </FooterText>
            <FooterText>
                <a href="mailto:contact@derecksnotes.com">
                    contact@derecksnotes.com
                </a>
            </FooterText>
        </FooterContainer>
    );
}

export default Footer;
