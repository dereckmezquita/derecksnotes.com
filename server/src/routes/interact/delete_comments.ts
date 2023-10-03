import { Router } from 'express';

import Comment from '@models/Comment';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';

const delete_comments = Router();

delete_comments.use(isAuthenticated);

delete_comments.delete('/delete_comments', async (req, res) => {
    try {
        const { commentIds } = req.body as { commentIds: string[] };

        if (!commentIds || !Array.isArray(commentIds)) {
            return res.status(400).json({ message: "Comment Ids are required." });
        }
        if (commentIds.length > 50) {
            return res.status(400).json({ message: "Cannot delete more than 50 comments at once." });
        }

        // ------------------------------------
        const userId = req.session.userId;

        if (!userId) return res.status(401).json({ message: "Unauthorized." });

        // get the userId for each comment that we want to delete
        const userIds = await Comment.find({ _id: { $in: commentIds } }).distinct('userId');

        // check that the user owns all the comments; return to them which comments they don't own (array)
        const commentsNotOwned: string[] = userIds.filter(id => id.toString() !== userId);

        if (commentsNotOwned.length) {
            // send back _ids of what comments they don't own
            return res.status(401).json({ message: `You do not own these comments: ${commentsNotOwned.join(', ')}` });
        }

        let deletedComments = await Comment.deleteManyOwnedByUser(commentIds, userId);

        // let's populate the comments with user profilePhotos and username
        // let's populate the comments with user profilePhotos and username
        await Comment.populate(deletedComments, {
            path: 'userId',
            select: 'username profilePhotos latestProfilePhoto',
            model: User
        });

        const comments = deletedComments.map(comment => {
            return comment.toObject({ virtuals: true });
        });

        const message: CommentInfoResponse = {
            comments: comments,
            hasMore: false
        }

        res.status(200).json(message);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

export default delete_comments;

/*

*/