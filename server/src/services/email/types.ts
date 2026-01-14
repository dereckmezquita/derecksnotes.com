export interface EmailMessage {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export interface EmailProvider {
    name: string;
    send(message: EmailMessage): Promise<boolean>;
    isConfigured(): boolean;
}

export interface EmailVerificationData {
    userId: string;
    email: string;
    token: string;
    expiresAt: Date;
}

export interface PasswordResetData {
    userId: string;
    email: string;
    token: string;
    expiresAt: Date;
}
