'use client';
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback
} from 'react';
import { api, ApiError } from '@/utils/api';
import type { User, AuthError } from '@derecksnotes/shared';

export type { User, AuthError };

interface AuthContextType {
    user: User | null;
    loading: boolean;
    register: (data: {
        username: string;
        password: string;
        email?: string;
    }) => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    changePassword: (
        currentPassword: string,
        newPassword: string
    ) => Promise<void>;
    updateProfile: (data: {
        displayName?: string;
        bio?: string;
        avatarUrl?: string | null;
    }) => Promise<void>;
    changeUsername: (newUsername: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
    isAuthenticated: () => boolean;
    isAdmin: () => boolean;
    hasPermission: (permission: string) => boolean;
    checkAuth: () => Promise<void>;
    authError: AuthError | null;
    clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_CHECK_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<AuthError | null>(null);

    const clearAuthError = useCallback(() => setAuthError(null), []);

    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get<User>('/auth/me');
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
        const interval = setInterval(checkAuth, AUTH_CHECK_INTERVAL);
        return () => clearInterval(interval);
    }, [checkAuth]);

    const register = async (data: {
        username: string;
        password: string;
        email?: string;
    }) => {
        setLoading(true);
        clearAuthError();
        try {
            await api.post('/auth/register', data);
            await checkAuth();
        } catch (error) {
            if (error instanceof ApiError) {
                setAuthError(error.data as AuthError);
            } else {
                setAuthError({ error: 'An unexpected error occurred' });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        setLoading(true);
        clearAuthError();
        try {
            await api.post('/auth/login', { username, password });
            await checkAuth();
        } catch (error) {
            if (error instanceof ApiError) {
                setAuthError(error.data as AuthError);
            } else {
                setAuthError({ error: 'An unexpected error occurred' });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Clear user even if server call fails
        } finally {
            setUser(null);
        }
    };

    const changePassword = async (
        currentPassword: string,
        newPassword: string
    ) => {
        clearAuthError();
        try {
            await api.post('/users/me/password', {
                currentPassword,
                newPassword
            });
        } catch (error) {
            if (error instanceof ApiError)
                setAuthError(error.data as AuthError);
            throw error;
        }
    };

    const updateProfile = async (data: {
        displayName?: string;
        bio?: string;
        avatarUrl?: string | null;
    }) => {
        clearAuthError();
        try {
            await api.patch('/users/me', data);
            if (user) {
                setUser({ ...user, ...data });
            }
        } catch (error) {
            if (error instanceof ApiError)
                setAuthError(error.data as AuthError);
            throw error;
        }
    };

    const changeUsername = async (newUsername: string) => {
        clearAuthError();
        try {
            await api.patch('/users/me/username', { username: newUsername });
            if (user) {
                setUser({ ...user, username: newUsername });
            }
        } catch (error) {
            if (error instanceof ApiError)
                setAuthError(error.data as AuthError);
            throw error;
        }
    };

    const deleteAccount = async () => {
        clearAuthError();
        try {
            await api.delete('/users/me');
            setUser(null);
        } catch (error) {
            if (error instanceof ApiError)
                setAuthError(error.data as AuthError);
            throw error;
        }
    };

    const isAuthenticated = useCallback(() => !!user, [user]);
    const isAdmin = useCallback(
        () => !!user && user.groups.includes('admin'),
        [user]
    );
    const hasPermission = useCallback(
        (permission: string) => !!user && user.permissions.includes(permission),
        [user]
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                changePassword,
                updateProfile,
                changeUsername,
                deleteAccount,
                isAuthenticated,
                isAdmin,
                hasPermission,
                checkAuth,
                authError,
                clearAuthError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
