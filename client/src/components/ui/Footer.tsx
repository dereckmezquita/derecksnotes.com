import styled from 'styled-components';
import { theme } from '@styles/theme';

const FooterContainer = styled.footer`
    margin: 0px auto;
    margin-top: 30px;
    padding: 0px;
    text-align: center;
    border-top: 1px solid ${theme.text.colour.light_grey()};

    width: 50%;
    @media (max-width: ${theme.container.widths.min_width_snap_up}) {
        width: 85%;
    }
`;

const FooterText = styled.p`
    font-size: 0.85rem;
    color: ${theme.text.colour.light_grey()};
`;

function Footer(): JSX.Element {
    return (
        <FooterContainer>
            <FooterText>
                All content on this website is copyright protected and belongs
                to Dereck Mezquita. You are not allowed to copy nor modify any
                content found on this website without written permission from
                the owner; Copyright © 2017 - 2023.
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
