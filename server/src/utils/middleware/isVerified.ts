import User from '@models/User';

/**
 * Check user has verified their e-mail address.
 */
const isVerified = async (req: any, res: any, next: any) => {
    const { userId } = req.session;

    try {
        const user = await User.findById(userId);
        if (user && user.email.verified) {
            next();
        } else {
            return res
                .status(403)
                .json({ message: 'Your email address is not verified.' });
        }
    } catch (error) {
        console.error('E-mail verification Check Error:', error);
        return res.status(500).json({
            message:
                'Failed to check user e-mail verification status. Please try again.'
        });
    }
};

export default isVerified;
