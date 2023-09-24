import { useState } from 'react';
import { FaUser, FaLock, FaAt } from 'react-icons/fa';
import Button from '@components/atomic/Button';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { logout } from '@store/userSlice';

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

    const [modalContent, setModalContent] = useState<'LOGIN' | 'USER_DETAILS' | 'REGISTER' | 'FORGOT_PASSWORD'>(isAuthenticated ? 'USER_DETAILS' : 'LOGIN');

    const renderView = (view: string): JSX.Element => {
        switch (view) {
            case 'LOGIN':
                return (
                    <Login
                        onSwitchToRegister={() => setModalContent('REGISTER')}
                        onSwitchToForgotPassword={() => setModalContent('FORGOT_PASSWORD')}
                        onClose={onClose}
                    />
                );
            case 'USER_DETAILS':
                return (
                    <UserDetails onClose={onClose} />
                );
            case 'REGISTER':
                return (
                    <Register 
                        onSwitchToLogin={() => setModalContent('LOGIN')}
                        onClose={onClose}
                    />
                );
            case 'FORGOT_PASSWORD':
                return (
                    <ForgotPassword onSwitchToLogin={() => setModalContent('LOGIN')} />
                );
            default:
                return (
                    <h2>Uknown error occured</h2>
                );
        }
    }

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                {renderView(modalContent)}
            </ModalContainer>
        </ModalOverlay>
    );
};

export default Auth;