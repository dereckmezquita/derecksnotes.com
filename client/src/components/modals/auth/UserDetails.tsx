import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@store/userSlice';
import { RootState } from '@store/store';

import { StyledButton } from './AuthStyles';

interface UserDetailsProps {
    onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ onClose }) => {
    const userData = useSelector((state: RootState) => state.user.data);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        onClose();
    };

    if (!userData) return null;

    return (
        <>
            <h2>Welcome, {userData.username}</h2>
            <p>Email: {userData.email?.address}</p>
            {/* Add any other user details you want to display */}
            <StyledButton onClick={handleLogout}>Logout</StyledButton>
        </>
    );
};

export default UserDetails;
