import { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaLock, FaAt } from 'react-icons/fa';
import { theme } from '@styles/theme';

import Button from '@components/atomic/Button';

import api_register from '@utils/api/register';
import api_login from '@utils/api/login';
import api_me from '@utils/api/me';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
`;

const ModalContainer = styled.div`
    width: 25%;
    margin: 0 auto;
    background-color: ${theme.container.background.colour.primary()};
    padding: 20px;
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${theme.container.shadow.box};
    @media (max-width: ${theme.container.widths.min_width_snap_up}) {
        width: 95%;
    }
`;

const InputField = styled.div`
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${theme.container.border.colour.primary()};
    padding-bottom: 5px;
    &:focus-within {
        border-bottom: 2px solid ${theme.theme_colours[5]()}; // Made it a little more pronounced
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 5px 5px 5px 10px;  // added left padding
    font-family: ${theme.text.font.times};
    font-size: 1em;
    color: ${theme.text.colour.primary()};
    border: none;
    outline: none;
    background-color: transparent;
    &::placeholder {
        opacity: 0.7;  // make placeholder slightly transparent
    }
`;

const LinkButton = styled.a`
    display: inline-block;
    cursor: pointer;
    color: #333;
    &:hover {
        text-decoration: underline;
    }
`;

const RegisterLink = styled(LinkButton)`
    float: left;
`;

const ResetLink = styled(LinkButton)`
    float: right;
`;

const StyledForm = styled.form`
    margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
    margin-top: 10px;  // spacing from the input fields
`;

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalContent, setModalContent] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>('LOGIN');

    const [isLoading, setIsLoading] = useState(false);

    // ------------------ LOGIN ------------------
    const [loginError, setLoginError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserInfo | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Username and password should not be empty!"); // Simple alert for user feedback
            return;
        }

        setIsLoading(true); // start the spinner or any loading indication

        try {
            const response = await api_login(username, password);

            const userDataResponse = await api_me();
            setUserData(userDataResponse);

            alert("Logged in successfully!"); // Simple alert for user feedback
            onClose(); // Close the modal

        } catch (error: any) {
            // If the server returns a message, use that, else default to a generic error message
            setLoginError(error.response?.data || "Error logging in. Please try again.");
        } finally {
            setIsLoading(false); // stop the spinner or loading indication
        }
    };

    // ------------------ REGISTER ------------------
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setRegisterError(null); // reset any previous errors
        setRegisterSuccess(null); // reset any previous success messages

        const form = e.currentTarget;
        const email = (form.elements.namedItem('newEmail') as HTMLInputElement)?.value;
        const username = (form.elements.namedItem('newUsername') as HTMLInputElement)?.value;
        const password = (form.elements.namedItem('newPassword') as HTMLInputElement)?.value;

        if (!email || !username || !password) {
            // Handle error (fields should not be empty)
            return;
        }

        try {
            const data = await api_register(email, username, password);
            setRegisterSuccess(data.message);
        } catch (error: any) {
            setRegisterError(error.message);
        }
    };

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to handle password reset
    };

    const renderModalContent = () => {
        if (userData) {
            return (
                <>
                    <h2>Welcome, {userData.username}</h2>
                    <p>
                        Email: {userData.email?.address}
                        {/* Add any other user details you want to display */}
                    </p>
                    <Button onClick={onClose}>Close</Button>
                </>
            );
        }

        switch (modalContent) {
            case 'LOGIN':
                return (
                    <>
                        <h2>Login</h2>
                        {
                            isLoading && <p>Loading...</p> // or replace with a spinner component if you have one
                        }
                        {
                            loginError && <p style={{ color: 'red' }}>{loginError}</p> // Displaying error messages
                        }
                        <StyledForm onSubmit={handleLogin}>
                            <InputField>
                                <FaUser style={{ marginRight: '10px' }} />
                                <Input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="Username"
                                />
                            </InputField>
                            <InputField>
                                <FaLock style={{ marginRight: '10px' }} />
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </InputField>
                            <StyledButton type="submit">Login</StyledButton>
                        </StyledForm>
                        <RegisterLink onClick={() => setModalContent('REGISTER')}>
                            Register
                        </RegisterLink>
                        <ResetLink onClick={() => setModalContent('FORGOT_PASSWORD')}>
                            Reset password
                        </ResetLink>
                    </>
                );
            case 'REGISTER':
                return (
                    <>
                        <h2>Register</h2>
                        {registerError && <p style={{ color: 'red' }}>{registerError}</p>}
                        {registerSuccess && <p style={{ color: 'green' }}>{registerSuccess}</p>}
                        <StyledForm onSubmit={handleRegister}>
                            <InputField>
                                <FaAt style={{ marginRight: '10px' }} />
                                <Input
                                    type="text"
                                    id="newEmail"
                                    placeholder="E-mail"
                                />
                            </InputField>
                            <InputField>
                                <FaUser style={{ marginRight: '10px' }} />
                                <Input
                                    type="text"
                                    id="newUsername"
                                    placeholder="Username"
                                />
                            </InputField>
                            <InputField>
                                <FaLock style={{ marginRight: '10px' }} />
                                <Input
                                    type="password"
                                    id="newPassword"
                                    placeholder="Password"
                                />
                            </InputField>
                            <StyledButton type="submit">Register</StyledButton>
                        </StyledForm>
                        <LinkButton onClick={() => setModalContent('LOGIN')}>
                            Login
                        </LinkButton>
                    </>
                );
            case 'FORGOT_PASSWORD':
                return (
                    <>
                        <h2>Reset Password</h2>
                        <StyledForm onSubmit={handlePasswordReset}>
                            <InputField>
                                <FaAt style={{ marginRight: '10px' }} />
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="E-mail"
                                />
                            </InputField>
                            <StyledButton type="submit">Send Reset Link</StyledButton>
                        </StyledForm>
                        <LinkButton onClick={() => setModalContent('LOGIN')}>
                            Login
                        </LinkButton>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                {renderModalContent()}
            </ModalContainer>
        </ModalOverlay>
    );
};

export default AuthModal;