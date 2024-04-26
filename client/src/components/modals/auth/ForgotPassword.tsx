import { FaAt } from 'react-icons/fa';
import {
    InputField,
    Input,
    StyledForm,
    StyledButton,
    LinkButton
} from './AuthStyles';

interface ForgotPasswordProps {
    onSwitchToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchToLogin }) => {
    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Logic to handle password reset
    };

    return (
        <>
            <h2>Reset Password</h2>
            <StyledForm onSubmit={handlePasswordReset}>
                <InputField>
                    <FaAt style={{ marginRight: '10px' }} />
                    <Input type="email" id="email" placeholder="E-mail" />
                </InputField>
                <StyledButton type="submit">Send Reset Link</StyledButton>
            </StyledForm>
            <LinkButton onClick={onSwitchToLogin}>Login</LinkButton>
        </>
    );
};

export default ForgotPassword;
