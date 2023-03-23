import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  /* Add styles for footer */
`;

const ScrollUp = styled.a`
  /* Add styles for .scroll-up */
`;

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <ScrollUp href="#">
                <span>Scroll</span>
            </ScrollUp>
            <p>
                All content on this website is copyright and belongs to Dereck de Mezquita. You are not allowed to copy nor modify any content found on this site without written permission from the owner; &copy; Copyright 2022.
            </p>
            <p>
                Contact: <a href="mailto: contact@demezquita.com">contact@demezquita.com</a>
            </p>
        </FooterContainer>
    );
};

export default Footer;