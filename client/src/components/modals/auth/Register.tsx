import { useState } from 'react';
import { FaUser, FaLock, FaAt } from 'react-icons/fa';
import {
    InputField, Input, StyledForm, StyledButton, LinkButton
} from './AuthStyles';
import api_register from '@utils/api/register';

interface RegisterProps {
    onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
    // ... existing register logic

    return (
        <>
            <h2>Register</h2>
            {/*... existing register JSX */}
            <LinkButton onClick={onSwitchToLogin}>
                Login
            </LinkButton>
        </>
    );
};

export default Register;
