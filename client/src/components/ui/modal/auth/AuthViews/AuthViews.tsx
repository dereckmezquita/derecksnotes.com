import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LoginView, RegisterView } from './views';
import { useAuth } from '@context/AuthContext';
import { IndicateLoading } from '@components/atomic/IndiacteLoading';

type ModalView = 'login' | 'register';

interface AuthViewsProps {
    signalAuthSuccess?: () => void;
    onTitleChange: (title: string) => void;
}

export function AuthViews({
    signalAuthSuccess,
    onTitleChange
}: AuthViewsProps) {
    const { login, register, checkAuth, loading } = useAuth();
    const [view, setView] = useState<ModalView>('login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        const titles = {
            login: 'Login',
            register: 'Register'
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
                    await login(formData.username, formData.password);
                    toast.success('Logged in successfully!', { id: toastId });
                    if (signalAuthSuccess) {
                        signalAuthSuccess();
                    }
                    break;
                case 'register':
                    if (formData.password !== formData.confirmPassword) {
                        toast.error('Passwords do not match', { id: toastId });
                        return;
                    }
                    await register({
                        username: formData.username,
                        password: formData.password,
                        email: formData.email || undefined
                    });
                    toast.success('Registered successfully!', { id: toastId });
                    if (signalAuthSuccess) {
                        signalAuthSuccess();
                    }
                    break;
                default:
                    throw new Error('Invalid view');
            }
        } catch (error: any) {
            console.error('Error:', error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.details?.[0]?.message ||
                'An unknown error occurred';
            toast.error(`Error: ${errorMessage}`, { id: toastId });
        }
    };

    const switchView = (newView: ModalView) => {
        setView(newView);
        // Clear form when switching views
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
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
            default:
                return <LoginView {...props} />;
        }
    };

    return renderView();
}
