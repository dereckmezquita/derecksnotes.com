import { Request, Response, Router } from 'express';
import sendmail from 'sendmail';

const email_hello_world = Router();

email_hello_world.get('/email_hello_world', (req: Request, res: Response) => {
    // Get the user's email address from the URL query parameters
    const userEmail = req.query.email as string;

    // Check if the email address is provided in the query
    if (!userEmail) {
        return res.status(400).json({ error: 'Email address is required in the query parameters.' });
    }

    // Create a sendmail instance
    const send = sendmail({});

    // Email message options
    const mailOptions = {
        from: 'no-reply@derecksnotes.com',
        to: userEmail,
        subject: 'Hello, World!',
        text: 'Hello, World! This is a test email.',
    };

    // Send the email
    send(mailOptions, (error) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'An error occurred while sending the email.' });
        }

        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully.' });
    });
});

export default email_hello_world;