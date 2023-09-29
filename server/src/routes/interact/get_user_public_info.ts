import express from 'express';
import User from "@models/User";
import mongoose from 'mongoose';

const get_user_public_info = express.Router();

get_user_public_info.get('/get_user_public_info/:username', async (req, res) => {
    const { username } = req.params;

    // we need to find by username
    const user = await User.findOne({ username }) as UserInfo & mongoose.Document;

    if (!user) return res.status(404).json({ message: "User not found" });

    // Destructure the properties from the user object
    const {
        name,
        profilePhotos,
        email,
        username: userUsername,
        latestProfilePhoto
    } = user.toObject({ virtuals: true });

    // Construct the userRes object
    const userRes: UserInfoPublicResponse = {
        profilePhotos,
        username: userUsername,
        latestProfilePhoto
    };

    res.status(200).json(userRes);
});

export default get_user_public_info;