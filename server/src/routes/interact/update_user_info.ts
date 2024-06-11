import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';
import mongoose from 'mongoose';

const update_user_info = Router();

interface UpdateUserInfoRequest {
    username?: string;
    email?: string;
    password?: { oldPassword: string; newPassword: string };
    firstName?: string;
    lastName?: string;
    geolocationId?: string;
}

update_user_info.put(
    '/update_user_info',
    isAuthenticated,
    async (req: Request, res: Response) => {
        try {
            const {
                username,
                email,
                password,
                firstName,
                lastName,
                geolocationId
            } = req.body as UpdateUserInfoRequest;

            if (
                !(
                    username ||
                    email ||
                    password ||
                    firstName ||
                    lastName ||
                    geolocationId
                )
            ) {
                return res.status(400).json({
                    message: 'At least one update parameter must be provided.'
                });
            }

            const userId = req.session.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized.' });
            }

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            if (username) {
                const isUsernameTaken = await User.findOne({ username });
                if (isUsernameTaken) {
                    return res
                        .status(400)
                        .json({ message: 'Username is already taken.' });
                }
                user.username = username;
            }

            if (email) {
                const isEmailTaken = await User.findOne({
                    'email.address': email
                });
                if (isEmailTaken) {
                    return res
                        .status(400)
                        .json({ message: 'Email is already taken.' });
                }
                user.email.address = email;
            }

            if (password) {
                const passCheck: boolean = await user.isPasswordCorrect(
                    password.oldPassword
                );
                if (!passCheck) {
                    return res
                        .status(400)
                        .json({ message: 'Old password is incorrect.' });
                }
                // WARNING: passwords are hashed by pre save hook
                // be careful not to double hash
                user.password = password.newPassword;
            }

            if (firstName) {
                user.name.first = firstName;
            }

            if (lastName) {
                user.name.last = lastName;
            }

            if (geolocationId) {
                if (!mongoose.Types.ObjectId.isValid(geolocationId)) {
                    return res
                        .status(400)
                        .json({ message: 'Invalid geolocationId format.' });
                }

                user.metadata.geolocations = user.metadata.geolocations.filter(
                    (geo) => {
                        return geo._id!.toString() !== geolocationId;
                    }
                );
            }

            await user.save();

            res.status(200).json({ message: 'User updated successfully.' });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
);

export default update_user_info;
