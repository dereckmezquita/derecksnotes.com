import { Router } from 'express';
import User, { UserDocument } from '@models/User';
import Comment, { CommentDocument } from '@models/Comment';

const me = Router();

me.get('/me', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const user = await User.findById<UserDocument>(req.session.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ip_address = req.headers['x-forwarded-for'] as string;

        await user.addOrUpdateGeoLocation(ip_address); // saves the user

        // convert and prep the user object; remove password
        const userObj: UserDTO = user.toObject({ virtuals: true });

        // Remove password from the response
        delete userObj.password;

        // send only 10 most recent geolocations; sorted in ascending order by hook
        userObj.metadata.geolocations = userObj.metadata.geolocations.slice(-10);

        // get their comment info and other; get only comments not marked as comment.deleted
        const comments = await Comment.find({
            userId: user._id,
            deleted: false
        })
            .populate('user', 'username profilePhotos')
            .sort({ createdAt: -1 })
            .exec(); // TODO: change to get comment IDs then use get_comments_threads_by_id

        const commentsCount: number = await Comment.countByUser(user._id);
        const commentsJudged: CommentDocument[] = await Comment.commentsJudgedByUser(user._id); // TODO: add pagination

        const message = {
            userInfo: userObj,
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