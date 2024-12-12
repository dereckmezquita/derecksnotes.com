// server/src/routes/comments/comments.ts
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

// Recursive helper
async function fetchCommentTree(
    parentComments: IComment[],
    depth: number
): Promise<ICommentTree[]> {
    if (depth <= 0) {
        return parentComments as ICommentTree[];
    }

    const parentIds = parentComments.map((c) => c._id);
    const replies = await Comment.find({ parentComment: { $in: parentIds } })
        .populate('author', 'username')
        .lean<IComment[]>();

    const repliesByParent: Record<string, IComment[]> = {};
    for (const reply of replies) {
        if (reply.parentComment) {
            const parentId = reply.parentComment.toString();
            if (!repliesByParent[parentId]) repliesByParent[parentId] = [];
            repliesByParent[parentId].push(reply);
        }
    }

    const results: ICommentTree[] = [];
    for (const parent of parentComments) {
        const parentIdStr = parent._id.toString();
        const children = repliesByParent[parentIdStr] || [];
        const nestedReplies = await fetchCommentTree(children, depth - 1);
        results.push({ ...parent, replies: nestedReplies });
    }

    return results;
}

// Create a new comment
router.post('/comments', async (req: Request, res: Response) => {
    try {
        const { text, postSlug, parentCommentId } = req.body;

        const userId = req.session?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Not authenticated' });

        const post = await Post.findOne({ slug: postSlug }).lean();
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const user = await User.findById(userId).lean();
        if (!user) return res.status(404).json({ error: 'User not found' });

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
            author: new Types.ObjectId(userId),
            post: post._id,
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

// Get comments for a post by slug
router.get('/comments/post/:postSlug', async (req: Request, res: Response) => {
    try {
        const { postSlug } = req.params;
        const depth = parseInt(req.query.depth as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 5; // Default limit
        const skip = parseInt(req.query.skip as string, 10) || 0; // Default skip

        const post = await Post.findOne({ slug: postSlug }).lean();
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // Apply limit & skip for top-level comments
        const topLevelComments = await Comment.find({
            post: post._id,
            parentComment: null
        })
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean<IComment[]>();

        const commentTree = await fetchCommentTree(topLevelComments, depth);
        return res.json(commentTree);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get more replies for a single comment subtree
router.get('/comments/:id/children', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const depth = parseInt(req.query.depth as string, 10) || 1;

        const comment = await Comment.findById(id)
            .populate('author', 'username')
            .lean<IComment>();
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        // Treat this comment as a parent and fetch its children at the given depth
        const tree = await fetchCommentTree([comment], depth);
        // tree[0] now has the updated replies
        return res.json(tree[0].replies || []);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single comment by ID (with optional depth)
router.get('/comments/:id', async (req: Request, res: Response) => {
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
router.put('/comments/:id', async (req: Request, res: Response) => {
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
router.delete('/comments/:id', async (req: Request, res: Response) => {
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
router.post('/comments/:id/like', async (req: Request, res: Response) => {
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
router.post('/comments/:id/dislike', async (req: Request, res: Response) => {
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
router.post('/comments/:id/unlike', async (req: Request, res: Response) => {
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
router.post('/comments/:id/undislike', async (req: Request, res: Response) => {
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
