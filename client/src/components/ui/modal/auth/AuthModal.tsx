import React, { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../Modal';
import {
    LoginView,
    RegisterView,
    ResetPasswordView,
    MagicLinkView
} from './auth-views';
import { api } from '@components/utils/api/api';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ModalView = 'login' | 'register' | 'reset' | 'magic-link';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [view, setView] = useState<ModalView>('magic-link');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Processing...');

        try {
            let response;
            switch (view) {
                case 'login':
                    response = await api.post('/auth/login', {
                        email: formData.email,
                        password: formData.password
                    });
                    toast.success('Logged in successfully!', { id: toastId });
                    break;
                case 'register':
                    response = await api.post('/auth/register', formData);
                    toast.success('Registered successfully!', { id: toastId });
                    break;
                case 'reset':
                    response = await api.post('/auth/reset-password', {
                        email: formData.email
                    });
                    toast.success('Password reset email sent!', {
                        id: toastId
                    });
                    break;
                case 'magic-link':
                    response = await api.post('/auth/magic-link', {
                        email: formData.email
                    });
                    toast.success('Magic link sent to your email!', {
                        id: toastId
                    });
                    break;
            }
            console.log(response.data);
            onClose();
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(
                `Error: ${error.response?.data?.error || 'An unknown error occurred'}`,
                { id: toastId }
            );
        }
    };

    const switchView = (newView: ModalView) => {
        setView(newView);
    };

    const renderView = () => {
        const props = {
            formData,
            handleInputChange,
            handleSubmit,
            switchView
        };

        switch (view) {
            case 'login':
                return <LoginView {...props} />;
            case 'register':
                return <RegisterView {...props} />;
            case 'reset':
                return <ResetPasswordView {...props} />;
            case 'magic-link':
                return <MagicLinkView {...props} />;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                view === 'login'
                    ? 'Login'
                    : view === 'register'
                      ? 'Register'
                      : view === 'reset'
                        ? 'Reset Password'
                        : 'Magic Link Login'
            }
        >
            {renderView()}
        </Modal>
    );
}
