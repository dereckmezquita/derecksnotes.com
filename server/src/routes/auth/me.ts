import { Router } from 'express';
import User, { UserDocument } from '@models/User';
import Comment, { CommentDocument } from '@models/Comment';
import isAuthenticated from '@utils/middleware/isAuthenticated';

const me = Router();

me.get('/me', isAuthenticated, async (req, res) => {
    try {
        let user = await User.findById<UserDocument>(req.session.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ip_address = req.headers['x-forwarded-for'] as string;

        user = await user.setAddOrUpdateGeoLocation(ip_address); // uses atomic operations

        // convert and prep the user object; remove password
        const userObj: UserDTO = user.toObject({ virtuals: true });

        // Remove password from the response
        delete userObj.password;

        // send only 10 most recent geolocations; sorted in ascending order by hook
        userObj.metadata.geolocations = userObj.metadata.geolocations.slice(-10);

        // only comments not marked comment.deleted
        const commentsIds = (await Comment.find({
            userId: user._id,
            deleted: false,
            $or: [
                { parentComment: null },
                { parentComment: { $ne: user._id } }
            ]
        }, '_id').exec())
        .map((comment: { _id: string }) => comment._id.toString());
        
        const commentsLikedIds = (await Comment.find({
            [`judgement.${user._id}`]: 'like'
        }, '_id').exec())
            .map((comment: { _id: string }) => comment._id.toString())

        const commentsDislikedIds = (await Comment.find({
            [`judgement.${user._id}`]: 'dislike'
        }, '_id').exec())
            .map((comment: { _id: string }) => comment._id.toString())

        const commentsNotDeletedCount: number = await Comment.find({ userId: user._id, deleted: false }).countDocuments();

        const message = {
            user: userObj,
            commentsIds: commentsIds.slice(-30),
            commentsLikedIds: commentsLikedIds.slice(-10),
            commentsDislikedIds: commentsDislikedIds.slice(-10),
            commentsCount: commentsNotDeletedCount
        }

        res.status(200).json(message);
    } catch (error) {
        console.error("/me Endpoint Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default me;