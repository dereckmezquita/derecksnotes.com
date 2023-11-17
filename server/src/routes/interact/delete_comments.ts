import { Request, Response, Router } from 'express';
import Comment, { CommentDocument, CommentModel } from '@models/Comment';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';
import isVerified from '@utils/middleware/isVerified';

import buildPopulateObject from '@utils/buildPopulateObject';

const delete_comments = Router();

interface DeleteCommentsRequest {
    commentIds: string[];
}

delete_comments.delete('/delete_comments', isAuthenticated, isVerified, async (req: Request, res: Response) => {
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

        let deletedComments = await Comment.deleteManyOwnedByUser(commentIds, userId);
        deletedComments = await Comment.populate(deletedComments, {
            path: 'user',
            select: 'username profilePhotos latestProfilePhoto',
            model: User
        });

        const depth = 10;  // maximum depth of child comments to populate
        deletedComments = await Comment.populate(deletedComments, [
            buildPopulateObject(depth)
        ]);

        // const comments = deletedComments.map(comment => {
        //     // return comment.toObject({ virtuals: true });
        //     // virtuals on comment bu also child comments
        //     const commentObj = comment.toObject({ virtuals: true });
        //     commentObj.children = commentObj.children.map((child: CommentDocument) => child.toObject({ virtuals: true }));
        //     return commentObj;
        // });
        const comments = deletedComments.map(comment => comment.toObject({ virtuals: true }));
        res.status(200).json({ comments, hasMore: false });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

export default delete_comments;