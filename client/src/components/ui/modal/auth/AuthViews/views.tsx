import React from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Label = styled.label`
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.7rem;
  color: ${(p) => p.theme.text.colour.light_grey()};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.6rem;
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: ${(p) => p.theme.container.border.radius};
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.95rem;
  color: ${(p) => p.theme.text.colour.primary()};
  background: ${(p) => p.theme.container.background.colour.card()};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.text.colour.header()};
  }

  &::placeholder {
    color: ${(p) => p.theme.text.colour.light_grey()};
    opacity: 0.7;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.6rem;
  background: ${(p) => p.theme.text.colour.header()};
  color: white;
  border: none;
  border-radius: ${(p) => p.theme.container.border.radius};
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SwitchLink = styled.button`
  background: none;
  border: none;
  color: ${(p) => p.theme.text.colour.anchor()};
  cursor: pointer;
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.8rem;
  text-align: center;
  padding: 0;
  margin-top: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

interface AuthViewProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
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
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Label>Username</Label>
        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
          required
          autoComplete="username"
        />
      </InputGroup>
      <InputGroup>
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />
      </InputGroup>
      <SubmitButton type="submit">Log In</SubmitButton>
      <SwitchLink type="button" onClick={() => switchView('register')}>
        Don&apos;t have an account? Register
      </SwitchLink>
    </Form>
  );
}

export function RegisterView({
  formData,
  handleInputChange,
  handleSubmit,
  switchView
}: AuthViewProps) {
  const passwordValid =
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[a-z]/.test(formData.password) &&
    /[0-9]/.test(formData.password);
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Label>Username</Label>
        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="3-30 characters"
          required
          minLength={3}
          maxLength={30}
          pattern="^[a-zA-Z0-9_-]+$"
          autoComplete="username"
        />
      </InputGroup>
      <InputGroup>
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Min 8 chars, upper + lower + number"
          required
          minLength={8}
          autoComplete="new-password"
        />
        {formData.password && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              fontSize: '0.65rem',
              marginTop: '0.2rem'
            }}
          >
            <span
              style={{
                color: formData.password.length >= 8 ? '#0F9960' : '#999'
              }}
            >
              {formData.password.length >= 8 ? '\u2713' : '\u2717'} 8+ chars
            </span>
            <span
              style={{
                color: /[A-Z]/.test(formData.password) ? '#0F9960' : '#999'
              }}
            >
              {/[A-Z]/.test(formData.password) ? '\u2713' : '\u2717'} Uppercase
            </span>
            <span
              style={{
                color: /[a-z]/.test(formData.password) ? '#0F9960' : '#999'
              }}
            >
              {/[a-z]/.test(formData.password) ? '\u2713' : '\u2717'} Lowercase
            </span>
            <span
              style={{
                color: /[0-9]/.test(formData.password) ? '#0F9960' : '#999'
              }}
            >
              {/[0-9]/.test(formData.password) ? '\u2713' : '\u2717'} Number
            </span>
          </div>
        )}
      </InputGroup>
      <InputGroup>
        <Label>Confirm Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Repeat your password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        {formData.confirmPassword && !passwordsMatch && (
          <span
            style={{
              fontSize: '0.65rem',
              color: '#c62828',
              marginTop: '0.1rem'
            }}
          >
            Passwords do not match
          </span>
        )}
      </InputGroup>
      <InputGroup>
        <Label>Email (optional)</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="For account recovery"
          autoComplete="email"
        />
      </InputGroup>
      <SubmitButton type="submit" disabled={!passwordValid || !passwordsMatch}>
        Create Account
      </SubmitButton>
      <SwitchLink type="button" onClick={() => switchView('login')}>
        Already have an account? Log in
      </SwitchLink>
    </Form>
  );
}
