import { Router } from 'express';
import mongoose from 'mongoose';
import User from '@models/User';
import CommentInfo from '@models/CommentInfo';
import geoLocate from '@utils/geoLocate';

const me = Router();

me.get('/me', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const user = await User.findById(req.session.userId) as UserInfo & mongoose.Document;

        if (!user) return res.status(404).json({ message: "User not found" });

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

        // be careful not to save before deleting data
        await user.save();
        // Remove password from the response
        user.password = undefined;

        // Slice the geoLocations and commentsJudged arrays to keep only the last 10 elements
        user.metadata.geoLocations = user.metadata.geoLocations.slice(-10);

        // get their comment info and other
        const comments = await CommentInfo.findByUser(user._id);
        const commentsJudged = await CommentInfo.commentsJudgedByUser(user._id);
        const commentsCount = await CommentInfo.countByUser(user._id);

        const message = {
            userInfo: {
                ...user.toObject({ virtuals: true }),
            },
            // only send back last 10 comments
            comments: comments.slice(-10),
            commentsJudged,
            commentsCount
        }

        res.status(200).json(message);
    } catch (error) {
        console.error("/me Endpoint Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default me;