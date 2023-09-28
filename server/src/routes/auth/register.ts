import { Router } from 'express';
import mongoose from 'mongoose';

import User from '../../models/User';
import geoLocate from '@utils/geoLocate';

const register = Router();

declare module 'express-session' {
    interface SessionData {
        userId: string;
        username: string;
    }
}

register.post('/register', async (req, res) => {
    console.log("Received Registration Request:", req.body);

    try {
        const { email, username, password } = req.body;

        const userExists = await User.findOne({ $or: [{ 'email.address': email }, { username }] });
        if (userExists) return res.status(400).json({ message: "User already exists." });

        const newUser = new User({
            email: {
                address: email,
                verified: false
            },
            username,
            password,
            metadata: {
                lastConnected: new Date()
            }
        } as UserInfo);

        const ip_address = req.headers['x-forwarded-for'] as string;

        try {
            const geo = await geoLocate(ip_address);

            const geoData: GeoLocation = {
                ...geo,
                firstUsed: new Date(),
                lastUsed: new Date()
            };

            // add geoLocation to user metadata
            newUser.metadata.geoLocations.push(geoData);
        } catch (error: any) {
            console.warn("GeoLocation Error:", error);
        }

        await newUser.save();

        // create session
        req.session.userId = newUser._id;
        req.session.username = newUser.username;

        res.status(201).json({ message: "User registered and logged in successfully" });
    } catch (error: any) {
        console.error("Registration Error:", error);

        // return mongoose error if there is one
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                error: "Validation Error",
                message: Object.values(error.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({ message: "Server Error" });
    }
});

export default register;