import { Router } from 'express';

const logout = Router();

logout.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout Error:', err);
            return res
                .status(500)
                .json({ message: `Server Error: ${err.message}` });
        }
        res.clearCookie('sid');
        res.status(200).json({ message: 'Logout successful' });
    });
});

export default logout;
