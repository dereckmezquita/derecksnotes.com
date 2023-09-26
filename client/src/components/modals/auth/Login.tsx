import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { fetchUserDataSuccess } from '@store/userSlice';
import {
    InputField, Input, StyledForm,
    StyledButton, LinkButton
} from './AuthStyles';
import api_login from '@utils/api/auth/login';
import api_me from '@utils/api/auth/me';

interface LoginProps {
    onSwitchToRegister: () => void;
    onSwitchToForgotPassword: () => void;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onSwitchToForgotPassword, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const dispatch = useDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Username and password should not be empty!"); 
            return;
        }

        setIsLoading(true);

        try {
            const response = await api_login(username, password);
            const userDataResponse = await api_me();

            dispatch(fetchUserDataSuccess(userDataResponse));

            alert("Logged in successfully!");
            onClose();
        } catch (error: any) {
            setLoginError(error.response?.data || "Error logging in. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h2>
                Login
            </h2>
            {isLoading && <p>Loading...</p>}
            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
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
            <LinkButton onClick={onSwitchToRegister} style={{float: 'left'}}>
                Register
            </LinkButton>
            <LinkButton onClick={onSwitchToForgotPassword} style={{float: 'right'}}>
                Reset password
            </LinkButton>
        </>
    );
};

export default Login;