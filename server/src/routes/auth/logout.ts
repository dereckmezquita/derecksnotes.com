import { Router } from 'express';

const logout = Router();

logout.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.status(500).json({ message: "Server Error" });
        }
        res.clearCookie('sid'); // Assuming 'sid' is your session ID cookie name
        res.status(200).json({ message: "Logout successful" });
    });
});

export default logout;