import React from 'react';
import styled from 'styled-components';

const InfoBarContainer = styled.div`
  /* Add styles for #info-bar */
`;

const Tickers = styled.div`
  /* Add styles for #tickers */
`;

const InfoBarTools = styled.div`
  /* Add styles for #info-bar-tools */
`;

const InfoBar: React.FC = () => {
    return (
        <InfoBarContainer>
            <Tickers>{/* Crypto tickers content will be rendered here */}</Tickers>
            <InfoBarTools>
                <a className="info-bar-icon user-login-icon">
                    <img src="/site-images/icons/user-login.png" className="theme-icon" />
                </a>
            </InfoBarTools>
        </InfoBarContainer>
    );
};

export default InfoBar;