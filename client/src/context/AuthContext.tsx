'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '@components/utils/api/api';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    isVerified: boolean;
    profilePhoto: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await api.get<{ user: User }>('/auth/user-info');
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post<{ user: User }>('/auth/login', {
            email,
            password
        });
        setUser(response.data.user);
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
