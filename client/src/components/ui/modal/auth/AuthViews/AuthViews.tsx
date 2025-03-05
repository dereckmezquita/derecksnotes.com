import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    LoginView,
    RegisterView,
    ResetPasswordView,
    MagicLinkView
} from './views';
import { api } from '@utils/api/api';
import { useAuth } from '@context/AuthContext';
import { IndicateLoading } from '@components/atomic/IndiacteLoading';

type ModalView = 'login' | 'register' | 'reset' | 'magic-link';

interface AuthViewsProps {
    signalAuthSuccess?: () => void;
    onTitleChange: (title: string) => void;
}

export function AuthViews({
    signalAuthSuccess,
    onTitleChange
}: AuthViewsProps) {
    const { checkAuth, loading } = useAuth();
    const [view, setView] = useState<ModalView>('login');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        // Set title based on current view
        const titles = {
            login: 'Login',
            register: 'Register',
            reset: 'Reset Password',
            'magic-link': 'Magic Link Login'
        };
        onTitleChange(titles[view]);
    }, [view, onTitleChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Processing...');

        try {
            switch (view) {
                case 'login':
                    {
                        const response = await api.post('/auth/login', {
                            email: formData.email,
                            password: formData.password
                        });
                        toast.success('Logged in successfully!', {
                            id: toastId
                        });
                        if (signalAuthSuccess) {
                            signalAuthSuccess();
                        }
                    }
                    break;
                case 'register':
                    {
                        const response = await api.post(
                            '/auth/register',
                            formData
                        );
                        toast.success(
                            'Registered successfully! You will be sent a magic link to login and verify your e-mail address.',
                            {
                                id: toastId
                            }
                        );
                        switchView('login');
                        if (signalAuthSuccess) {
                            signalAuthSuccess();
                        }
                    }
                    break;
                case 'reset':
                    {
                        const response = await api.post(
                            '/auth/reset-password',
                            {
                                email: formData.email
                            }
                        );
                        toast.success('Password reset email sent!', {
                            id: toastId
                        });
                        if (signalAuthSuccess) {
                            signalAuthSuccess();
                        }
                    }
                    break;
                case 'magic-link':
                    {
                        const response = await api.post('/auth/magic-link', {
                            email: formData.email
                        });
                        toast.success('Magic link sent to your email!', {
                            id: toastId
                        });
                        if (signalAuthSuccess) {
                            signalAuthSuccess();
                        }
                    }
                    break;
                default:
                    throw new Error('Invalid view');
            }
            checkAuth();
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(
                `Error: ${error.response?.data?.error || 'An unknown error occurred'}`,
                { id: toastId }
            );
        }
    };

    // Removed handleLogout function as it's no longer needed

    const switchView = (newView: ModalView) => {
        setView(newView);
    };

    if (loading) {
        return <IndicateLoading />;
    }

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
            default:
                return <LoginView {...props} />;
        }
    };

    return renderView();
}
