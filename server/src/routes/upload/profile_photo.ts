import { Router } from 'express';
import upload from '@utils/upload';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import User from '../../models/User';  // Make sure this path is correct.

import { DATETIME_YYYY_MM_DD_HHMMSS, ROOT_DIR_CLIENT_UPLOADS } from '@utils/constants';

const profile_photo = Router();

profile_photo.post('/profile_photo', async (req, res) => {
    // Check if user is logged in and the session contains the username
    if (!req.session.userId || !req.session.username) {
        return res.status(401).json({ message: "Not logged in" });
    }

    const username = req.session.username; // get the username from the session

    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        const imageName: string = 'optimised_' + username + '_' + DATETIME_YYYY_MM_DD_HHMMSS() + path.extname(req.file.originalname);
        const finalPath = path.join(ROOT_DIR_CLIENT_UPLOADS, imageName);

        try {
            await sharp(req.file.buffer)
                .resize(1000)
                .jpeg({ quality: 70 })
                .toFile(finalPath);
    
            const user = await User.findById(req.session.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            user.profilePhotos.push(imageName);  // Add the new photo to the array
            
            // Check if number of photos exceeds 5
            while (user.profilePhotos.length > 5) {
                const removedPhoto = user.profilePhotos.shift();  // Remove the oldest photo
    
                if (removedPhoto) {
                    // Remove the oldest photo from the filesystem
                    fs.unlink(path.join(ROOT_DIR_CLIENT_UPLOADS, removedPhoto), (err) => {
                        if (err) console.error(`Failed to delete photo: ${removedPhoto}`, err);
                    });
                }
            }
            
            await user.save();
    
            res.status(200).json({ message: "Image uploaded, processed, and saved", imageName: imageName });
    
        } catch (error) {
            console.error("Error while processing image or updating user:", error);
            res.status(500).json({ message: "Server Error" });
        }
    });
});

export default profile_photo;


// db.users.deleteOne({ "username": "test" })
// db.users.updateOne({ "username": "test" }, { $unset: { profilePhotos: "" } })