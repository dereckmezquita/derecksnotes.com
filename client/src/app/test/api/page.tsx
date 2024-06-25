'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@components/utils/api/api';
import {
    Article,
    PostContainer
} from '@components/components/pages/posts-dictionaries';
import {
    Input,
    InputField,
    SubmitButton
} from '@components/components/ui/modal/forms';
import styled from 'styled-components';

import CommentDemo from './CommentDemo';
import { useAuth } from '@components/context/AuthContext';

interface ApiResponse {
    message: string;
    data: any;
}

const PostArticle: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
    <PostContainer>
        <Article sideBar={false} style={{ width: '90%' }}>
            {children}
        </Article>
    </PostContainer>
);

const UserCardContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const UserCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

const StyledInput = styled(Input)`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const StyledButton = styled(SubmitButton)`
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

const TabContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
    padding: 10px 20px;
    background-color: ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
    color: ${(props) => (props.active ? 'white' : 'black')};
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${(props) => (props.active ? '#0056b3' : '#e0e0e0')};
    }
`;

const Page: React.FC = () => {
    const { user, login, logout } = useAuth();
    const [data, setData] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [activeTab, setActiveTab] = useState('login');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const toastId = toast.loading('Fetching data...');
        try {
            const response = await api.get<ApiResponse>('/');
            setData(response.data);
            toast.success('Data fetched successfully!', { id: toastId });
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(
                error instanceof Error
                    ? error
                    : new Error('An unknown error occurred')
            );
            toast.error(`Failed to fetch data: ${error}`, { id: toastId });
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Logged in successfully!');
        } catch (error) {
            toast.error(
                `Failed to log in: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully!');
        } catch (error) {
            toast.error(
                `Failed to log out: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Registering...');
        try {
            await api.post('/auth/register', {
                firstName,
                lastName,
                username,
                email,
                password
            });
            toast.success('Registered successfully! Please log in.', {
                id: toastId
            });
            setActiveTab('login');
        } catch (error) {
            console.error('Error registering:', error);
            toast.error(
                `Failed to register: ${error instanceof Error ? error.message : 'Unknown error'}`,
                { id: toastId }
            );
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Sending password reset email...');
        try {
            await api.post('/auth/reset-password', { email });
            toast.success('Password reset email sent!', { id: toastId });
        } catch (error) {
            console.error('Error sending password reset:', error);
            toast.error(
                `Failed to send password reset: ${error instanceof Error ? error.message : 'Unknown error'}`,
                { id: toastId }
            );
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Sending magic link...');
        try {
            await api.post('/auth/magic-link', { email });
            toast.success('Magic link sent to your email!', { id: toastId });
        } catch (error) {
            console.error('Error sending magic link:', error);
            toast.error(
                `Failed to send magic link: ${error instanceof Error ? error.message : 'Unknown error'}`,
                { id: toastId }
            );
        }
    };

    if (error) {
        return (
            <PostArticle>
                <h1>Error</h1>
                <pre>{error.message}</pre>
            </PostArticle>
        );
    }

    return (
        <PostArticle>
            <h1>API Test Page</h1>
            <UserCardContainer>
                <UserCard>
                    {user ? (
                        <>
                            <h2>Welcome, {user.username}!</h2>
                            <p>Email: {user.email}</p>
                            <p>Verified: {user.isVerified ? 'Yes' : 'No'}</p>
                            <p>Role: {user.role}</p>
                            <StyledButton onClick={handleLogout}>
                                Logout
                            </StyledButton>
                        </>
                    ) : (
                        <>
                            <TabContainer>
                                <Tab
                                    active={activeTab === 'login'}
                                    onClick={() => setActiveTab('login')}
                                >
                                    Login
                                </Tab>
                                <Tab
                                    active={activeTab === 'register'}
                                    onClick={() => setActiveTab('register')}
                                >
                                    Register
                                </Tab>
                                <Tab
                                    active={activeTab === 'reset'}
                                    onClick={() => setActiveTab('reset')}
                                >
                                    Reset Password
                                </Tab>
                                <Tab
                                    active={activeTab === 'magic'}
                                    onClick={() => setActiveTab('magic')}
                                >
                                    Magic Link
                                </Tab>
                            </TabContainer>
                            {activeTab === 'login' && (
                                <StyledForm onSubmit={handleLogin}>
                                    <InputField>
                                        <StyledInput
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Email"
                                            required
                                        />
                                    </InputField>
                                    <InputField>
                                        <StyledInput
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Password"
                                            required
                                        />
                                    </InputField>
                                    <StyledButton type="submit">
                                        Login
                                    </StyledButton>
                                </StyledForm>
                            )}
                            {activeTab === 'register' && (
                                <StyledForm onSubmit={handleRegister}>
                                    <InputField>
                                        <StyledInput
                                            type="text"
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            placeholder="First Name"
                                            required
                                        />
                                    </InputField>
                                    <InputField>
                                        <StyledInput
                                            type="text"
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            placeholder="Last Name"
                                        />
                                    </InputField>
                                    <InputField>
                                        <StyledInput
                                            type="text"
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            placeholder="Username"
                                            required
                                        />
                                    </InputField>
                                    <InputField>
                                        <StyledInput
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Email"
                                            required
                                        />
                                    </InputField>
                                    <InputField>
                                        <StyledInput
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Password"
                                            required
                                        />
                                    </InputField>
                                    <StyledButton type="submit">
                                        Register
                                    </StyledButton>
                                </StyledForm>
                            )}
                            {activeTab === 'reset' && (
                                <StyledForm onSubmit={handlePasswordReset}>
                                    <InputField>
                                        <StyledInput
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Email"
                                            required
                                        />
                                    </InputField>
                                    <StyledButton type="submit">
                                        Reset Password
                                    </StyledButton>
                                </StyledForm>
                            )}
                            {activeTab === 'magic' && (
                                <StyledForm onSubmit={handleMagicLink}>
                                    <InputField>
                                        <StyledInput
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Email"
                                            required
                                        />
                                    </InputField>
                                    <StyledButton type="submit">
                                        Send Magic Link
                                    </StyledButton>
                                </StyledForm>
                            )}
                        </>
                    )}
                </UserCard>
            </UserCardContainer>
            <h2>API Data:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>

            <CommentDemo />
        </PostArticle>
    );
};

export default Page;
