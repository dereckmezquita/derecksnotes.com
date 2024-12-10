import { Router } from 'express';
import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Comment } from '../../db/models/Comment';
import type { IComment } from '../../db/models/Comment';
import { Post } from '../../db/models/Post';
import { User } from '../../db/models/User';

const router = Router();

interface ICommentTree extends IComment {
    replies?: ICommentTree[];
}

// Recursive function to fetch comments with nested replies up to a given depth
async function fetchCommentTree(
    parentComments: IComment[],
    depth: number
): Promise<ICommentTree[]> {
    if (depth <= 0) {
        // Return as is, no deeper fetching of replies
        return parentComments as ICommentTree[];
    }

    const parentIds = parentComments.map((comment) => comment._id);
    const replies = await Comment.find({ parentComment: { $in: parentIds } })
        .populate('author', 'username')
        .lean<IComment[]>();

    const repliesByParent: Record<string, IComment[]> = {};
    for (const reply of replies) {
        if (reply.parentComment) {
            const parentId = reply.parentComment.toString();
            if (!repliesByParent[parentId]) {
                repliesByParent[parentId] = [];
            }
            repliesByParent[parentId].push(reply);
        }
    }

    const results: ICommentTree[] = [];
    for (const parent of parentComments) {
        const parentIdStr = parent._id.toString();
        const children = repliesByParent[parentIdStr] || [];
        const nestedReplies = await fetchCommentTree(children, depth - 1);
        results.push({
            ...parent,
            replies: nestedReplies
        });
    }

    return results;
}

// Create a new comment or reply
router.post('/', async (req: Request, res: Response) => {
    try {
        const { text, postId, authorId, parentCommentId } = req.body;

        const [postExists, userExists] = await Promise.all([
            Post.findById(postId).lean(),
            User.findById(authorId).lean()
        ]);
        if (!postExists)
            return res.status(404).json({ error: 'Post not found' });
        if (!userExists)
            return res.status(404).json({ error: 'User not found' });

        if (parentCommentId) {
            const parentComment =
                await Comment.findById(parentCommentId).lean<IComment>();
            if (!parentComment) {
                return res
                    .status(400)
                    .json({ error: 'Parent comment not found' });
            }
        }

        const newComment = await Comment.create({
            text,
            originalContent: text,
            author: new Types.ObjectId(authorId),
            post: new Types.ObjectId(postId),
            parentComment: parentCommentId
                ? new Types.ObjectId(parentCommentId)
                : null
        });

        return res.status(201).json(newComment);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get comments for a post (with optional depth)
router.get('/post/:postId', async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const depth = parseInt(req.query.depth as string, 10) || 1;

        const topLevelComments = await Comment.find({
            post: postId,
            parentComment: null
        })
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .lean<IComment[]>();

        const commentTree = await fetchCommentTree(topLevelComments, depth);
        return res.json(commentTree);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single comment by ID (with optional depth)
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const depth = parseInt(req.query.depth as string, 10) || 1;
        const comment = await Comment.findById(id)
            .populate('author', 'username')
            .lean<IComment>();
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        const tree = await fetchCommentTree([comment], depth);
        return res.json(tree[0]);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a comment (user must be the author)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { text, userId } = req.body;

        const comment = await Comment.findById(id);
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        if (comment.author.toString() !== userId) {
            return res
                .status(403)
                .json({ error: 'Not authorised to update this comment' });
        }

        if (!comment.deleted) {
            comment.text = text;
            await comment.save();
        }

        return res.json(comment);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Soft delete a comment (user must be the author)
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(id);
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        if (comment.author.toString() !== userId) {
            return res
                .status(403)
                .json({ error: 'Not authorised to delete this comment' });
        }

        comment.deleted = true;
        comment.text = '[deleted]';
        await comment.save();

        return res.json({ message: 'Comment deleted successfully', comment });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Like a comment
router.post('/:id/like', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const comment = await Comment.findById(id);
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        // Remove from dislikes
        comment.dislikes = comment.dislikes.filter(
            (u) => u.toString() !== userId
        );

        // Add to likes if not already
        if (!comment.likes.find((u) => u.toString() === userId)) {
            comment.likes.push(new Types.ObjectId(userId));
        }

        await comment.save();
        return res.json(comment);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Dislike a comment
router.post('/:id/dislike', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const comment = await Comment.findById(id);
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        // Remove from likes
        comment.likes = comment.likes.filter((u) => u.toString() !== userId);

        // Add to dislikes if not already
        if (!comment.dislikes.find((u) => u.toString() === userId)) {
            comment.dislikes.push(new Types.ObjectId(userId));
        }

        await comment.save();
        return res.json(comment);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Unlike a comment
router.post('/:id/unlike', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const comment = await Comment.findById(id);
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        // Remove user from likes
        comment.likes = comment.likes.filter((u) => u.toString() !== userId);
        await comment.save();
        return res.json(comment);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Undislike a comment
router.post('/:id/undislike', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const comment = await Comment.findById(id);
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        // Remove user from dislikes
        comment.dislikes = comment.dislikes.filter(
            (u) => u.toString() !== userId
        );
        await comment.save();
        return res.json(comment);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
