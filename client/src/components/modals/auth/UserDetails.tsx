import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@store/userSlice';
import { RootState } from '@store/store';

import { StyledButton } from './AuthStyles';

import api_logout from '@utils/api/logout';
import api_request_email_verification from '@utils/api/request_email_verification';

import { FaEnvelope, FaCalendarAlt, FaMapPin, FaComment } from 'react-icons/fa';

const CardContainer = styled.div`
    text-align: center;
`;

const InfoBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    font-size: 0.9em;
`;

const EmailStatus = styled.span<{ verified: boolean }>`
    color: ${props => props.verified ? '#4CAF50' : '#FF5252'};
    font-weight: ${props => props.verified ? 'normal' : 'bold'};
`;

const VerifyEmail = styled.a`
    text-decoration: none;
    cursor: pointer;
    color: #FF5252;
    &:hover {
        text-decoration: underline;
    }
`;

const Icon = styled.span`
    margin-right: 10px;
`;

const LinkToProfile = styled(Link)`
    padding-top: 10px;
    display: inline-block;
    cursor: pointer;
    color: #333;
    &:hover {
        text-decoration: underline;
    }
`;

interface UserDetailsProps {
    onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ onClose }) => {
    const userData = useSelector((state: RootState) => state.user.data);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await api_logout();
        console.log(res);

        dispatch(logout());
        onClose();
    };

    const { email, metadata, username } = userData;

    return (
        <CardContainer>
            <h2>Welcome, {username}</h2>
            <InfoBlock>
                <div>
                    <Icon><FaEnvelope /></Icon>Email: {email?.address}
                </div>
                {email?.verified
                    ? <EmailStatus verified={true}>verified</EmailStatus>
                    : <VerifyEmail onClick={api_request_email_verification}>verify</VerifyEmail>
                }
            </InfoBlock>
            <InfoBlock>
                <div>
                    <Icon><FaCalendarAlt /></Icon>Last Connected
                </div>
                {new Date(metadata.lastConnected).toLocaleString()}
            </InfoBlock>
            <InfoBlock>
                <div>
                    <Icon><FaMapPin /></Icon>Geo Locations
                </div>
                {metadata.geoLocations.length}
            </InfoBlock>
            <InfoBlock>
                <div>
                    <Icon><FaComment /></Icon>Comments Judged
                </div>
                {metadata.commentsJudged.length}
            </InfoBlock>
            <StyledButton style={{ float: 'left' }} onClick={handleLogout}>Logout</StyledButton>
            <LinkToProfile style={{ float: 'right' }} href={`/myaccount`}>
                My profile
            </LinkToProfile>
        </CardContainer>
    );
};

export default UserDetails;