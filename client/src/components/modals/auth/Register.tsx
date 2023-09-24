import { useState } from 'react';
import { FaUser, FaLock, FaAt } from 'react-icons/fa';
import {
    InputField, Input, StyledForm,
    StyledButton, LinkButton
} from './AuthStyles';

import api_register from '@utils/api/register';
import api_me from '@utils/api/me';

import { useDispatch } from 'react-redux';
import { fetchUserDataSuccess } from '@store/userSlice';

interface RegisterProps {
    onSwitchToLogin: () => void;
    onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onClose }) => {
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

    const dispatch = useDispatch();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setRegisterError(null);
        setRegisterSuccess(null);

        const form = e.currentTarget;
        const email = (form.elements.namedItem('newEmail') as HTMLInputElement)?.value;
        const username = (form.elements.namedItem('newUsername') as HTMLInputElement)?.value;
        const password = (form.elements.namedItem('newPassword') as HTMLInputElement)?.value;

        if (!email || !username || !password) {
            return;
        }

        try {
            const data = await api_register(email, username, password);
            const userDataResponse = await api_me();

            setRegisterSuccess(data.message);

            // Fetch user data after successful registration and set in Redux store
            dispatch(fetchUserDataSuccess(userDataResponse));
            onClose();
        } catch (error: any) {
            setRegisterError(error.message);
        }
    };

    return (
        <>
            <h2>Register</h2>
            {registerError && <p style={{ color: 'red' }}>{registerError}</p>}
            {registerSuccess && <p style={{ color: 'green' }}>{registerSuccess}</p>}
            <StyledForm onSubmit={handleRegister}>
                <InputField>
                    <FaAt style={{ marginRight: '10px' }} />
                    <Input type="text" id="newEmail" placeholder="E-mail" />
                </InputField>
                <InputField>
                    <FaUser style={{ marginRight: '10px' }} />
                    <Input type="text" id="newUsername" placeholder="Username" />
                </InputField>
                <InputField>
                    <FaLock style={{ marginRight: '10px' }} />
                    <Input type="password" id="newPassword" placeholder="Password" />
                </InputField>
                <StyledButton type="submit">Register</StyledButton>
            </StyledForm>
            <LinkButton onClick={onSwitchToLogin}>
                Login
            </LinkButton>
        </>
    );
};

export default Register;
