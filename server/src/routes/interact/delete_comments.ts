import { Request, Response, Router } from 'express';
import Comment from '@models/Comment';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';

const delete_comments = Router();

interface DeleteCommentsRequest {
    commentIds: string[];
}

delete_comments.delete('/delete_comments', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const { commentIds } = req.body as DeleteCommentsRequest;

        if (!commentIds || !Array.isArray(commentIds)) {
            return res.status(400).json({ message: "Comment Ids are required." });
        }

        if (commentIds.length > 50) {
            return res.status(400).json({ message: "Cannot delete more than 50 comments at once." });
        }

        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        const userIds = await Comment.find({ _id: { $in: commentIds } }).distinct('userId');
        const commentsNotOwned = userIds.filter(id => id.toString() !== userId);

        if (commentsNotOwned.length) {
            return res.status(401).json({ message: `You do not own these comments: ${commentsNotOwned.join(', ')}` });
        }

        const deletedComments = await Comment.deleteManyOwnedByUser(commentIds, userId);
        await Comment.populate(deletedComments, {
            path: 'user',
            select: 'username profilePhotos latestProfilePhoto',
            model: User
        });

        const comments = deletedComments.map(comment => comment.toObject({ virtuals: true }));
        res.status(200).json({ comments, hasMore: false });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

export default delete_comments;