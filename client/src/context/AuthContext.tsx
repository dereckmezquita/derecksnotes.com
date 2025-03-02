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
 * User preference settings
 */
export interface UserPreferences {
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
}

/**
 * Represents a user in the system.
 */
export interface User {
    id: string;
    firstName: string;
    lastName?: string;
    username: string;
    email: string;
    isVerified: boolean;
    profilePhoto: string;
    role: string;
    createdAt?: string;
    lastLogin?: string;
    preferences?: UserPreferences;
}

/**
 * Authentication response error types
 */
export type AuthErrorCode =
    | 'INVALID_CREDENTIALS'
    | 'ACCOUNT_LOCKED'
    | 'USER_NOT_FOUND'
    | 'SERVER_ERROR'
    | 'VERIFICATION_REQUIRED'
    | 'MISSING_FIELDS'
    | 'INVALID_TOKEN'
    | 'WEAK_PASSWORD'
    | 'USER_EXISTS'
    | 'INVALID_USERNAME'
    | 'USERNAME_TAKEN';

/**
 * Authentication error response
 */
export interface AuthError {
    error: string;
    code: AuthErrorCode;
    attemptsLeft?: number;
    lockUntil?: string;
    field?: string;
}

/**
 * The shape of the authentication context.
 */
interface AuthContextType {
    /** The current user, or null if not authenticated */
    user: User | null;
    /** Indicates whether an authentication operation is in progress */
    loading: boolean;
    /** Function to register a new user */
    register: (userData: {
        firstName: string;
        lastName?: string;
        username: string;
        email: string;
        password: string;
    }) => Promise<void>;
    /** Function to log in a user with email/password */
    login: (
        email: string,
        password: string,
        rememberMe?: boolean
    ) => Promise<void>;
    /** Function to request a magic link login */
    requestMagicLink: (email: string) => Promise<{ isNewUser: boolean }>;
    /** Function to log out the current user */
    logout: () => Promise<void>;
    /** Function to request a password reset email */
    requestPasswordReset: (email: string) => Promise<void>;
    /** Function to reset password with a token */
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    /** Function to change password (authenticated) */
    changePassword: (
        currentPassword: string,
        newPassword: string
    ) => Promise<void>;
    /** Function to update user profile */
    updateProfile: (profileData: {
        firstName?: string;
        lastName?: string;
        username?: string;
    }) => Promise<void>;
    /** Function to update user preferences */
    updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
    /** Function to check if user is authenticated */
    isAuthenticated: () => boolean;
    /** Function to check if user is verified */
    isVerified: () => boolean;
    /** Function to check if user is admin */
    isAdmin: () => boolean;
    /** Function to check the current authentication status */
    checkAuth: () => Promise<void>;
    /** Function to manually set the authentication status to unauthenticated */
    setUnauthenticated: () => void;
    /** Last authentication error */
    authError: AuthError | null;
    /** Clear the authentication error */
    clearAuthError: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set the interval for periodic authentication checks
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
            const response = await api.get<{ user: User }>('/auth/user-info');
            setUser(response.data.user);
        } catch (error) {
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

    // Effect to check auth status on mount and set up periodic checks
    useEffect(() => {
        checkAuth();

        const intervalId = setInterval(checkAuth, AUTH_CHECK_INTERVAL);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, [checkAuth]);

    /**
     * Register a new user
     */
    const register = async (userData: {
        firstName: string;
        lastName?: string;
        username: string;
        email: string;
        password: string;
    }) => {
        setLoading(true);
        clearAuthError();

        try {
            await api.post('/auth/register', userData);
            // Don't automatically set user - they need to verify email first
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({
                    error: 'An unexpected error occurred',
                    code: 'SERVER_ERROR'
                });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Log in a user with the provided credentials.
     */
    const login = async (
        email: string,
        password: string,
        rememberMe = false
    ) => {
        setLoading(true);
        clearAuthError();

        try {
            const response = await api.post<{ user: User }>('/auth/login', {
                email,
                password,
                rememberMe
            });
            setUser(response.data.user);
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({
                    error: 'An unexpected error occurred',
                    code: 'SERVER_ERROR'
                });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Request a magic link for passwordless login
     */
    const requestMagicLink = async (email: string) => {
        setLoading(true);
        clearAuthError();

        try {
            const response = await api.post<{ isNewUser: boolean }>(
                '/auth/magic-link',
                { email }
            );
            return { isNewUser: response.data.isNewUser };
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({
                    error: 'An unexpected error occurred',
                    code: 'SERVER_ERROR'
                });
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
            setUser(null);
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            }
            // Still set user to null even if logout fails server-side
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Request a password reset email
     */
    const requestPasswordReset = async (email: string) => {
        setLoading(true);
        clearAuthError();

        try {
            await api.post('/auth/reset-password-request', { email });
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({
                    error: 'An unexpected error occurred',
                    code: 'SERVER_ERROR'
                });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reset password with token
     */
    const resetPassword = async (token: string, newPassword: string) => {
        setLoading(true);
        clearAuthError();

        try {
            const response = await api.post<{ user: User }>(
                '/auth/reset-password',
                {
                    token,
                    newPassword
                }
            );

            // Auto-login after password reset
            setUser(response.data.user);
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({
                    error: 'An unexpected error occurred',
                    code: 'SERVER_ERROR'
                });
            }
            throw error;
        } finally {
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
            await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({
                    error: 'An unexpected error occurred',
                    code: 'SERVER_ERROR'
                });
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
        firstName?: string;
        lastName?: string;
        username?: string;
    }) => {
        setLoading(true);
        clearAuthError();

        try {
            const response = await api.put<{ user: User }>(
                '/auth/profile',
                profileData
            );
            setUser(response.data.user);
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({
                    error: 'An unexpected error occurred',
                    code: 'SERVER_ERROR'
                });
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update user preferences
     */
    const updatePreferences = async (preferences: Partial<UserPreferences>) => {
        setLoading(true);
        clearAuthError();

        try {
            const response = await api.put<{ preferences: UserPreferences }>(
                '/auth/preferences',
                preferences
            );

            // Update user preferences while keeping other user data
            if (user) {
                setUser({
                    ...user,
                    preferences: response.data.preferences
                });
            }
        } catch (error: any) {
            if (error.response?.data) {
                setAuthError(error.response.data as AuthError);
            } else {
                setAuthError({
                    error: 'An unexpected error occurred',
                    code: 'SERVER_ERROR'
                });
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
     * Check if user is verified
     */
    const isVerified = useCallback(() => {
        return !!user && user.isVerified;
    }, [user]);

    /**
     * Check if user is admin
     */
    const isAdmin = useCallback(() => {
        return !!user && user.role === 'admin';
    }, [user]);

    // Create the context value object
    const value: AuthContextType = {
        user,
        loading,
        register,
        login,
        requestMagicLink,
        logout,
        requestPasswordReset,
        resetPassword,
        changePassword,
        updateProfile,
        updatePreferences,
        isAuthenticated,
        isVerified,
        isAdmin,
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
