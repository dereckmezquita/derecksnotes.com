import { Router } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const router = Router();

router.post('/register', async (req, res) => {
    console.log("Received Registration Request:", req.body);

    try {
        const { email, username, password } = req.body;

        const userExists = await User.findOne({ $or: [{ 'email.address': email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            email: {
                address: email,
                verified: false
            },
            username,
            password
        });

        await newUser.save();
        
        // create session
        req.session.userId = newUser._id;
        res.status(201).json({ message: "User registered and logged in successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

router.post('/login', async (req, res) => {
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

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.status(500).json({ message: "Server Error" });
        }
        res.clearCookie('sid'); // Assuming 'sid' is your session ID cookie name
        res.status(200).json({ message: "Logout successful" });
    });
});

router.get('/me', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const user = await User.findById(req.session.userId) as UserInfo & mongoose.Document;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove password from the response
        user.password = undefined;

        // Slice the geoLocations and commentsJudged arrays to keep only the last 10 elements
        user.metadata.geoLocations = user.metadata.geoLocations.slice(-10);
        user.metadata.commentsJudged = user.metadata.commentsJudged ? user.metadata.commentsJudged.slice(-10) : [];

        res.status(200).json(user);
    } catch (error) {
        console.error("/me Endpoint Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


export default router;
