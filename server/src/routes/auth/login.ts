import { Router } from 'express';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import geoLocate from '@utils/geoLocate';

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

        const ip_address = req.headers['x-forwarded-for'] as string;

        try {
            const geo = await geoLocate(ip_address);
            
            const geoData: GeoLocation = {
                ...geo,
                firstUsed: new Date(),
                lastUsed: new Date()
            };

            user.metadata.geoLocations.push(geoData);
        } catch (error) {
            console.warn("GeoLocation Error:", error);
        }

        user.metadata.lastConnected = new Date();

        await user.save();

        // handle sessions here
        req.session.userId = user._id;

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default login;