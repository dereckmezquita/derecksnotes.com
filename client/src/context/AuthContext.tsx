'use client';
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback
} from 'react';
import { api } from '@components/utils/api/api';
import { HOUR } from '@components/lib/datetimes';

/**
 * Represents a user in the system.
 * TODO: we should have shared interfaces between client and server
 */
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    isVerified: boolean;
    profilePhoto: string;
    role: string;
}

/**
 * The shape of the authentication context.
 */
interface AuthContextType {
    /** The current user, or null if not authenticated */
    user: User | null;
    /** Indicates whether an authentication operation is in progress */
    loading: boolean;
    /** Function to log in a user */
    login: (email: string, password: string) => Promise<void>;
    /** Function to log out the current user */
    logout: () => Promise<void>;
    /** Function to check the current authentication status */
    checkAuth: () => Promise<void>;
    /**
     * Function to manually set the authentication status to unauthenticated.
     * Use this throughout the application if an error is thrown
     * and we need to reset the user's authentication status.
     */
    setUnauthenticated: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set the interval for periodic authentication checks
const AUTH_CHECK_INTERVAL = HOUR * 24;

/**
 * AuthProvider component that wraps the application and provides authentication context.
 *
 * @param {React.PropsWithChildren<{}>} props - The component props
 * @returns {JSX.Element} The AuthProvider component
 */
export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    /**
     * Check the current authentication status.
     * This function is memoized to prevent unnecessary re-renders.
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
     * This function is memoized to prevent unnecessary re-renders.
     */
    const setUnauthenticated = useCallback(() => {
        setUser(null);
    }, []);

    // Effect to check auth status on mount and set up periodic checks
    useEffect(() => {
        checkAuth();

        const intervalId = setInterval(checkAuth, AUTH_CHECK_INTERVAL);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, [checkAuth]);

    /**
     * Log in a user with the provided credentials.
     *
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     */
    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await api.post<{ user: User }>('/auth/login', {
                email,
                password
            });
            setUser(response.data.user);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Log out the current user.
     */
    const logout = async () => {
        setLoading(true);
        try {
            await api.post('/auth/logout');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Create the context value object
    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        checkAuth,
        setUnauthenticated
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

/**
 * Custom hook to use the authentication context.
 *
 * @returns {AuthContextType} The authentication context
 * @throws {Error} If used outside of an AuthProvider
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
