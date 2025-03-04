import React from 'react';
import {
    StyledForm,
    InputField,
    Input,
    SubmitButton,
    SwitchViewButton
} from '../../forms';

interface AuthViewProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    switchView: (view: 'login' | 'register' | 'reset' | 'magic-link') => void;
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
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                />
            </InputField>
            <SubmitButton type="submit">Log In</SubmitButton>
            <SwitchViewButton
                type="button"
                onClick={() => switchView('register')}
            >
                Register
            </SwitchViewButton>
            <SwitchViewButton type="button" onClick={() => switchView('reset')}>
                Reset password
            </SwitchViewButton>
            <SwitchViewButton
                type="button"
                onClick={() => switchView('magic-link')}
            >
                Magic Link
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
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />
            </InputField>
            <InputField>
                <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                />
            </InputField>
            <InputField>
                <Input
                    type="text"
                    name="username"
                    placeholder="Username (lowercase)"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    minLength={2}
                    maxLength={25}
                />
            </InputField>
            <InputField>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                />
            </InputField>
            <SubmitButton type="submit">Register</SubmitButton>
            <SwitchViewButton type="button" onClick={() => switchView('login')}>
                Login
            </SwitchViewButton>
        </StyledForm>
    );
}

export function ResetPasswordView({
    formData,
    handleInputChange,
    handleSubmit,
    switchView
}: AuthViewProps) {
    return (
        <StyledForm onSubmit={handleSubmit}>
            <InputField>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </InputField>
            <SubmitButton type="submit">Reset Password</SubmitButton>
            <SwitchViewButton type="button" onClick={() => switchView('login')}>
                Login
            </SwitchViewButton>
        </StyledForm>
    );
}

export function MagicLinkView({
    formData,
    handleInputChange,
    handleSubmit,
    switchView
}: AuthViewProps) {
    return (
        <StyledForm onSubmit={handleSubmit}>
            <InputField>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </InputField>
            <SubmitButton type="submit">Send Magic Link</SubmitButton>
            <SwitchViewButton type="button" onClick={() => switchView('login')}>
                Login
            </SwitchViewButton>
        </StyledForm>
    );
}

import Link from 'next/link';
import { User } from '@context/AuthContext';
import { IndicateStatusDot } from '@components/atomic/IndicateStatusDot';

interface LoggedInViewProps {
    user: User;
    handleLogout: () => void;
}

export function LoggedInView({ user, handleLogout }: LoggedInViewProps) {
    return (
        <StyledForm>
            <p>
                <IndicateStatusDot isLoggedIn={true} /> {user.username}!
            </p>
            <div style={{ marginBottom: '20px' }}>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>First Name:</strong> {user.firstName}
                </p>
                <p>
                    <strong>Last Name:</strong> {user.lastName}
                </p>
                <p>
                    <strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}
                </p>
                <p>
                    <strong>Role:</strong> {user.role}
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
