import type { EmailProvider, EmailMessage } from './types';

/**
 * Stub email provider for development.
 * Logs emails to console instead of sending them.
 * Replace with a real provider (SendGrid, Resend, SES, etc.) in production.
 */
export class StubEmailProvider implements EmailProvider {
    name = 'stub';

    async send(message: EmailMessage): Promise<boolean> {
        console.log('='.repeat(50));
        console.log('📧 EMAIL (stub - not actually sent)');
        console.log('='.repeat(50));
        console.log(`To: ${message.to}`);
        console.log(`Subject: ${message.subject}`);
        console.log('-'.repeat(50));
        console.log(message.text);
        console.log('='.repeat(50));

        return true;
    }

    isConfigured(): boolean {
        return true; // Stub is always "configured"
    }
}
