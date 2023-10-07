import express from 'express';
import User, { UserDocument } from "@models/User";

const get_user_public_info = express.Router();

get_user_public_info.get('/get_user_public_info/:username', async (req, res) => {
    const { username } = req.params;

    // we need to find by username
    const user = await User.findOne<UserDocument>({ username });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Destructure the properties from the user object
    const userObj: UserDTO = user.toObject({ virtuals: true });

    // console.log(JSON.stringify(userObj));

    // Construct the userRes object
    const userResponse: UserPublicDTO = {
        username: userObj.username,
        latestProfilePhoto: userObj.latestProfilePhoto,
        profilePhotos: userObj.profilePhotos,
    };

    res.status(200).json(userResponse);
});

export default get_user_public_info;
