'use client';
import React, { useState } from 'react';
import { useAuth } from '@components/context/AuthContext';
import { BoxContainer } from '../modules/BoxContainer';
import { AuthViews } from '@components/components/ui/modal/auth/AuthViews/AuthViews';
import { IndicateLoading } from '@components/components/atomic/IndiacteLoading';
import { IndicateStatusDot } from '@components/components/atomic/IndicateStatusDot';

export function AuthDemo() {
    const [title, setTitle] = useState('Login');
    return (
        <BoxContainer>
            <h2 style={{ paddingBottom: '5px' }}>{title}</h2>
            <AuthViews onTitleChange={setTitle} />
        </BoxContainer>
    );
}

export const AuthProtectedDemo: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <IndicateLoading />;
    }

    return (
        <BoxContainer>
            <h3>Auth Status</h3>
            <p>
                <IndicateStatusDot isLoggedIn={!!user} />
                {user ? 'Logged In' : 'Not Logged In'}
            </p>
            {user && (
                <div>
                    <p>Welcome, {user.username}!</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
        </BoxContainer>
    );
};
