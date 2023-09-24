import { Router } from 'express';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const login = Router();

declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

login.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }) as UserInfo & mongoose.Document;

        if (!user) return res.status(401).json({ message: "Invalid login credentials" });
        
        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) return res.status(401).json({ message: "Invalid login credentials" });

        // handle sessions here
        req.session.userId = user._id;

        // For simplicity, let's return a success message
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default login;