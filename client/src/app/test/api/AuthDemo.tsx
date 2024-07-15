'use client';
import React from 'react';
import { api } from '@components/utils/api/api';
import { useAuth } from '@components/context/AuthContext';
import { CardContainerDiv } from '@components/components/pages/index/Card';

export function AuthDemo() {
    const { user, login, logout } = useAuth();

    return (
        <CardContainerDiv>
            <p>Hello</p>
        </CardContainerDiv>
    );
}
