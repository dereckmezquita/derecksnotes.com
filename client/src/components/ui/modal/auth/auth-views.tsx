import React from 'react';
import {
    StyledForm,
    InputField,
    Input,
    SubmitButton,
    SwitchViewButton
} from '../forms';

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
                Don't have an account? Register
            </SwitchViewButton>
            <SwitchViewButton type="button" onClick={() => switchView('reset')}>
                Forgot password?
            </SwitchViewButton>
            <SwitchViewButton type="button" onClick={() => switchView('magic-link')}>
                Login with Magic Link
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
                    placeholder="Username"
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
                Already have an account? Log in
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
                Back to login
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
                Back to login
            </SwitchViewButton>
        </StyledForm>
    );
}