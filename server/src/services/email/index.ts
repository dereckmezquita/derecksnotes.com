import type { EmailProvider, EmailMessage } from './types';
import { StubEmailProvider } from './stub';
import { config } from '../../lib/env';

export * from './types';

// Initialize provider based on environment
// To add a new provider:
// 1. Create a new file (e.g., sendgrid.ts) implementing EmailProvider
// 2. Import it here
// 3. Add configuration check and instantiation
let provider: EmailProvider;

function initializeProvider(): EmailProvider {
    // For now, always use stub. To enable a real provider:
    // if (process.env.SENDGRID_API_KEY) {
    //     return new SendGridProvider(process.env.SENDGRID_API_KEY);
    // }
    // if (process.env.RESEND_API_KEY) {
    //     return new ResendProvider(process.env.RESEND_API_KEY);
    // }

    console.log('📧 Email: Using stub provider (emails logged to console)');
    return new StubEmailProvider();
}

provider = initializeProvider();

export function getEmailProvider(): EmailProvider {
    return provider;
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
    if (!provider.isConfigured()) {
        console.warn('Email provider not configured, skipping email');
        return false;
    }
    return provider.send(message);
}

// Template helpers
export function sendVerificationEmail(
    email: string,
    token: string
): Promise<boolean> {
    const verifyUrl = `${config.baseUrl}/verify-email?token=${token}`;

    return sendEmail({
        to: email,
        subject: "Verify your email - Dereck's Notes",
        text: `Please verify your email by clicking this link: ${verifyUrl}\n\nThis link expires in 24 hours.`,
        html: `
            <h1>Verify your email</h1>
            <p>Please verify your email by clicking the link below:</p>
            <p><a href="${verifyUrl}">Verify Email</a></p>
            <p>This link expires in 24 hours.</p>
        `
    });
}

export function sendPasswordResetEmail(
    email: string,
    token: string
): Promise<boolean> {
    const resetUrl = `${config.baseUrl}/reset-password?token=${token}`;

    return sendEmail({
        to: email,
        subject: "Reset your password - Dereck's Notes",
        text: `Reset your password by clicking this link: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
        html: `
            <h1>Reset your password</h1>
            <p>Reset your password by clicking the link below:</p>
            <p><a href="${resetUrl}">Reset Password</a></p>
            <p>This link expires in 1 hour.</p>
            <p><em>If you didn't request this, please ignore this email.</em></p>
        `
    });
}
