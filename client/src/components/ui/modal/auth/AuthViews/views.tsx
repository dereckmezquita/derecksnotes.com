import React from 'react';
import Link from 'next/link';
import {
    StyledForm,
    InputField,
    Input,
    SubmitButton,
    SwitchViewButton
} from '../../forms';
import { User } from '@context/AuthContext';
import { IndicateStatusDot } from '@components/atomic/IndicateStatusDot';

interface AuthViewProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    switchView: (view: 'login' | 'register') => void;
}

export function LoginView({
    formData,
    handleInputChange,
    handleSubmit,
    switchView
}: AuthViewProps) {
    return (
        <StyledForm onSubmit={handleSubmit}>
            <InputField>
                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoComplete="username"
                />
            </InputField>
            <InputField>
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    autoComplete="current-password"
                />
            </InputField>
            <SubmitButton type="submit">Log In</SubmitButton>
            <SwitchViewButton
                type="button"
                onClick={() => switchView('register')}
            >
                Create an account
            </SwitchViewButton>
        </StyledForm>
    );
}

export function RegisterView({
    formData,
    handleInputChange,
    handleSubmit,
    switchView
}: AuthViewProps) {
    return (
        <StyledForm onSubmit={handleSubmit}>
            <InputField>
                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    minLength={3}
                    maxLength={30}
                    pattern="^[a-zA-Z0-9_-]+$"
                    title="Username can only contain letters, numbers, underscores, and hyphens"
                    autoComplete="username"
                />
            </InputField>
            <InputField>
                <Input
                    type="password"
                    name="password"
                    placeholder="Password (min 8 chars, 1 uppercase, 1 number)"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
                />
            </InputField>
            <InputField>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email (optional)"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                />
            </InputField>
            <SubmitButton type="submit">Register</SubmitButton>
            <SwitchViewButton type="button" onClick={() => switchView('login')}>
                Already have an account? Login
            </SwitchViewButton>
        </StyledForm>
    );
}

interface LoggedInViewProps {
    user: User;
    handleLogout: () => void;
}

export function LoggedInView({ user, handleLogout }: LoggedInViewProps) {
    return (
        <StyledForm>
            <p>
                <IndicateStatusDot isLoggedIn={true} />{' '}
                {user.displayName || user.username}
            </p>
            <div style={{ marginBottom: '20px' }}>
                <p>
                    <strong>Username:</strong> {user.username}
                </p>
                {user.email && (
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                )}
                {user.bio && (
                    <p>
                        <strong>Bio:</strong> {user.bio}
                    </p>
                )}
                <p>
                    <strong>Groups:</strong> {user.groups.join(', ')}
                </p>
            </div>
            <Link href="/profile" passHref>
                Go to profile page
            </Link>
            <SubmitButton type="button" onClick={handleLogout}>
                Logout
            </SubmitButton>
        </StyledForm>
    );
}
