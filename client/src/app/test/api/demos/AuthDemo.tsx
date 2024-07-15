'use client';
import React, { useState } from 'react';
import { useAuth } from '@components/context/AuthContext';
import { BoxContainer } from '../modules/BoxContainer';
import { AuthViews } from '@components/components/ui/modal/auth/AuthViews/AuthViews';

export function AuthDemo() {
    const [title, setTitle] = useState('Login');
    const { user, login, logout } = useAuth();

    return (
        <BoxContainer>
            <h2 style={{ paddingBottom: '5px' }}>{title}</h2>
            <AuthViews onTitleChange={setTitle} />
        </BoxContainer>
    );
}
