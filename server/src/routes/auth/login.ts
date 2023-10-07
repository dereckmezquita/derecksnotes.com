import { Router } from 'express';
import User, { UserDocument } from '@models/User';

const login = Router();

declare module 'express-session' {
    interface SessionData {
        userId: string;
        username: string;
    }
}

login.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne<UserDocument>({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }

        const isMatch = await user.isPasswordCorrect(password);
        // const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }

        const ip_address = req.headers['x-forwarded-for'] as string;

        await user.addOrUpdateGeoLocation(ip_address); // saves the user

        // handle sessions here
        req.session.userId = user._id;
        req.session.username = user.username;

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default login;