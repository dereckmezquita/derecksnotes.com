import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../../models/User';

const me = Router();

me.get('/me', async (req, res) => {
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


export default me;