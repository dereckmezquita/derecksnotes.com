import { FaAt } from 'react-icons/fa';
import { InputField, Input, StyledForm, StyledButton, LinkButton } from './AuthStyles';

interface ForgotPasswordProps {
    onSwitchToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchToLogin }) => {
    const handlePasswordReset = (e: React.FormEvent) => {
        // ... existing reset logic
    };

    return (
        <>
            <h2>Reset Password</h2>
            {/*... existing reset password JSX */}
            <LinkButton onClick={onSwitchToLogin}>
                Login
            </LinkButton>
        </>
    );
};

export default ForgotPassword;
