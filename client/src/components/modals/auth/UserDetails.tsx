import React, { useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@store/userSlice';
import { RootState } from '@store/store';

import { StyledButton } from './AuthStyles';

import api_logout from '@utils/api/auth/logout';
import api_request_email_verification from '@utils/api/auth/request_email_verification';

import { FaEnvelope, FaCalendarAlt, FaMapPin, FaComment, FaCheck, FaTimes } from 'react-icons/fa';

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

        dispatch(logout());
        onClose();
    };

    const handleEmailVerification = async () => {
        if (!userData || !userData.user.email.address) {
            alert('No email address found for verification.');
            return;
        }

        const email = userData.user.email.address;

        try {
            const response = await fetch(`https://www.derecksnotes.com/api/interact/email_verification_req?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                alert('Verification email sent! Please check your email.');
            } else {
                alert(`Failed to send verification email: ${data.message}`);
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            alert('Failed to send verification email. Please try again later.');
        }
    };

    // The useEffect hook is for side effects that occur after rendering.
    // Direct rendering logic, like conditionally returning JSX or null, should be outside of useEffect.
    useEffect(() => {
        if (!userData) {
            onClose();
        }
    }, [userData, onClose]);

    if (!userData) return null;

    return (
        <CardContainer>
            <h2>Welcome, {userData.user.username}</h2>
            <InfoBlock>
                <div>
                    <Icon><FaEnvelope /></Icon>Email: {userData.user.email.address}
                </div>
                {userData.user.email.verified ? (
                    <Icon as={FaCheck} style={{ color: 'green' }} />
                ) : (
                    <Icon as={FaTimes} style={{ color: 'red', cursor: 'pointer' }} onClick={handleEmailVerification} />
                )}
            </InfoBlock>
            <InfoBlock>
                <div>
                    <Icon><FaCalendarAlt /></Icon>Last Connected
                </div>
                {new Date(userData.user.metadata.lastConnected).toLocaleString()}
            </InfoBlock>
            <InfoBlock>
                <div>
                    <Icon><FaMapPin /></Icon>Geo Locations
                </div>
                {userData.user.metadata.geolocations.length}
            </InfoBlock>
            <InfoBlock>
                <div>
                    <Icon><FaComment /></Icon>Comments
                </div>
                {userData.commentsIds.length}
            </InfoBlock>
            <StyledButton style={{ float: 'left' }} onClick={handleLogout}>Logout</StyledButton>
            <LinkToProfile
                style={{ float: 'right' }}
                href={`/myaccount`}
                onClick={onClose}
            >
                My profile
            </LinkToProfile>
        </CardContainer>
    );
};

export default React.memo(UserDetails);

// { "user": { "name": { "first": "Dereck", "last": null }, "email": { "address": "dereck@mezquita.io", "verified": false }, "metadata": { "lastConnected": "2023-10-14T17:14:59.604Z", "geolocations": [{ "ip": "::1", "country": "Antarctica", "countryCode": "AQ", "flag": "🇦🇶", "regionName": "Unknown", "city": "Unknown", "isp": "Unknown", "org": "Unknown", "firstUsed": "2023-10-14T17:14:59.981Z", "lastUsed": "2023-10-15T17:42:52.506Z", "_id": "652acc93cfae14c19c7df697", "id": "652acc93cfae14c19c7df697" }] }, "_id": "652acc93cfae14c19c7df696", "profilePhotos": ["optimised_dereck_2023-10-15-153628.png", "optimised_dereck_2023-10-15-155729.png", "optimised_dereck_2023-10-15-160042.png", "optimised_dereck_2023-10-15-165214.png", "optimised_dereck_2023-10-15-170117.png"], "username": "dereck", "__v": 597, "latestProfilePhoto": "optimised_dereck_2023-10-15-170117.png", "id": "652acc93cfae14c19c7df696" }, "commentsIds": ["652acef6cfae14c19c7df6b0", "652acef9cfae14c19c7df6b6", "652acefccfae14c19c7df6c1", "652aceffcfae14c19c7df6ce", "652acf01cfae14c19c7df6db", "652acf04cfae14c19c7df6e6", "652acf07cfae14c19c7df6ec", "652ad060cfae14c19c7df769", "652ad092cfae14c19c7df7a2"], "commentsLikedIds": [], "commentsDislikedIds": [], "commentsCount": 9 }