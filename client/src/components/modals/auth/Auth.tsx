import { useState } from 'react';

// redux
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

// modals
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import UserDetails from './UserDetails';
import { ModalContainer, ModalOverlay } from './AuthStyles';

interface AuthProps {
    onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const [modalContent, setModalContent] = useState<
        'LOGIN' | 'USER_DETAILS' | 'REGISTER' | 'FORGOT_PASSWORD'
    >(isAuthenticated ? 'USER_DETAILS' : 'LOGIN');

    const [isMouseDownInside, setIsMouseDownInside] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsMouseDownInside(e.currentTarget === e.target);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (isMouseDownInside && e.currentTarget === e.target) {
            onClose();
        }
    };

    const renderView = (view: string): JSX.Element => {
        switch (view) {
            case 'LOGIN':
                return (
                    <Login
                        onSwitchToRegister={() => setModalContent('REGISTER')}
                        onSwitchToForgotPassword={() =>
                            setModalContent('FORGOT_PASSWORD')
                        }
                        onClose={onClose}
                    />
                );
            case 'USER_DETAILS':
                return <UserDetails onClose={onClose} />;
            case 'REGISTER':
                return (
                    <Register
                        onSwitchToLogin={() => setModalContent('LOGIN')}
                        onClose={onClose}
                    />
                );
            case 'FORGOT_PASSWORD':
                return (
                    <ForgotPassword
                        onSwitchToLogin={() => setModalContent('LOGIN')}
                    />
                );
            default:
                return <h2>Uknown error occured</h2>;
        }
    };

    return (
        <ModalOverlay onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                {renderView(modalContent)}
            </ModalContainer>
        </ModalOverlay>
    );
};

export default Auth;
