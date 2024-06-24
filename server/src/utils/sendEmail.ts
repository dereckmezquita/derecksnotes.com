import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from './env';

sgMail.setApiKey(SENDGRID_API_KEY);

async function sendEmail(
    to: string,
    subject: string,
    html: string
): Promise<void> {
    try {
        await sgMail.send({
            to,
            from: 'api@derecksnotes.com',
            subject,
            html
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export { sendEmail };
