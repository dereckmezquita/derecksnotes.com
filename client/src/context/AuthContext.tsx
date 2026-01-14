'use client';
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback
} from 'react';
import { api } from '@utils/api/api';
import { HOUR } from '@lib/datetimes';

/**
 * Represents a user in the system.
 * Matches the server's user response format.
 */
export interface User {
    id: string;
    username: string;
    email: string | null;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    createdAt: string;
    groups: string[];
    permissions: string[];
}

/**
 * Authentication error response
 */
export interface AuthError {
    error: string;
    details?: Array<{ message: string; path?: string[] }>;
}

/**
 * The shape of the authentication context.
 */
interface AuthContextType {
    user: User | null;
    loading: boolean;
    register: (userData: {
        username: string;
        password: string;
        email?: string;
    }) => Promise<void>;
    login: (usernameOrEmail: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    changePassword: (
        currentPassword: string,
        newPassword: string
    ) => Promise<void>;
    updateProfile: (profileData: {
        displayName?: string;
        bio?: string;
        avatarUrl?: string | null;
    }) => Promise<void>;
    deleteAccount: () => Promise<void>;
    isAuthenticated: () => boolean;
    isAdmin: () => boolean;
    hasPermission: (permission: string) => boolean;
    checkAuth: () => Promise<void>;
    setUnauthenticated: () => void;
    authError: AuthError | null;
    clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_CHECK_INTERVAL = HOUR * 24;

/**
 * AuthProvider component that wraps the application and provides authentication context.
 */
export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<AuthError | null>(null);

    /**
     * Check the current authentication status.
     */
    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<User>('/auth/me');
            setUser(response.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Set the authentication status to unauthenticated.
     */
    const setUnauthenticated = useCallback(() => {
        setUser(null);
    }, []);

    /**
     * Clear the authentication error.
     */
    const clearAuthError = useCallback(() => {
        setAuthError(null);
    }, []);

    useEffect(() => {
        checkAuth();

        const intervalId = setInterval(checkAuth, AUTH_CHECK_INTERVAL);
        return () => clearInterval(intervalId);
    }, [checkAuth]);

    /**
     * Register a new user
     */
    const register = async (userData: {
        username: string;
        password: string;
        email?: string;
    }) => {
        setLoading(true);
        clearAuthError();

        try {
            const response = await api.post<{
                user: { id: string; username: string };
            }>('/auth/register', userData);
            // After registration, fetch full user data
            await checkAuth();
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({ error: 'An unexpected error occurred' });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Log in a user with username or email
     */
    const login = async (usernameOrEmail: string, password: string) => {
        setLoading(true);
        clearAuthError();

        try {
            await api.post('/auth/login', {
                username: usernameOrEmail,
                password
            });
            // After login, fetch full user data
            await checkAuth();
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({ error: 'An unexpected error occurred' });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Log out the current user.
     */
    const logout = async () => {
        setLoading(true);
        clearAuthError();

        try {
            await api.post('/auth/logout');
        } catch {
            // Still clear user even if logout fails server-side
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    /**
     * Change password (authenticated)
     */
    const changePassword = async (
        currentPassword: string,
        newPassword: string
    ) => {
        setLoading(true);
        clearAuthError();

        try {
            await api.post('/users/me/password', {
                currentPassword,
                newPassword
            });
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({ error: 'An unexpected error occurred' });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update user profile
     */
    const updateProfile = async (profileData: {
        displayName?: string;
        bio?: string;
        avatarUrl?: string | null;
    }) => {
        setLoading(true);
        clearAuthError();

        try {
            const response = await api.patch<User>('/users/me', profileData);
            // Update local user state with new profile data
            if (user) {
                setUser({
                    ...user,
                    ...response.data
                });
            }
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({ error: 'An unexpected error occurred' });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete user account (soft delete)
     */
    const deleteAccount = async () => {
        setLoading(true);
        clearAuthError();

        try {
            await api.delete('/users/me');
            setUser(null);
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({ error: 'An unexpected error occurred' });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = useCallback(() => {
        return !!user;
    }, [user]);

    /**
     * Check if user is admin
     */
    const isAdmin = useCallback(() => {
        return !!user && user.groups.includes('admin');
    }, [user]);

    /**
     * Check if user has a specific permission
     */
    const hasPermission = useCallback(
        (permission: string) => {
            return !!user && user.permissions.includes(permission);
        },
        [user]
    );

    const value: AuthContextType = {
        user,
        loading,
        register,
        login,
        logout,
        changePassword,
        updateProfile,
        deleteAccount,
        isAuthenticated,
        isAdmin,
        hasPermission,
        checkAuth,
        setUnauthenticated,
        authError,
        clearAuthError
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

/**
 * Custom hook to use the authentication context.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
