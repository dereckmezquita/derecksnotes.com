// server/src/routes/profile/profile.ts
import { Router } from 'express';
import type { Request, Response } from 'express';
import { User } from '../../db/models/User';
import { Comment } from '../../db/models/Comment';
import {
    isAuthAndVerifiedMiddleware,
    authMiddleware
} from '../../middleware/isAuth';
import { Types } from 'mongoose';
import crypto from 'crypto';
import { TOKEN_SIZE, TOKEN_VALIDITY_HOURS } from '../../utils/constants';
import { API_URL } from '../../utils/env';
import { sendEmail } from '../../utils/sendEmail';

const router = Router();

// Get current user info (must be verified to access profile info fully)
router.get(
    '/profile/user-info',
    authMiddleware,
    async (req: Request, res: Response) => {
        const user = (req as any).user;
        res.json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                profilePhoto: user.profilePhoto,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    }
);

// Update user info (e.g., email, names)
router.patch(
    '/profile/update',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const user = (req as any).user;
        const { firstName, lastName, email } = req.body;

        let emailChanged = false;

        if (email && email !== user.email) {
            user.email = email.toLowerCase();
            user.isVerified = false; // reset verification because email changed
            emailChanged = true;
        }
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;

        await user.save();

        if (emailChanged) {
            // Optionally, send verification email automatically upon email change or let user trigger it manually.
            // For now, just inform the client they need to verify.
            return res.json({
                message:
                    'Profile updated. Please verify your new email address.'
            });
        }

        res.json({ message: 'Profile updated', user });
    }
);

// Get comments created by the user
router.get(
    '/profile/comments',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const user = (req as any).user;
        const comments = await Comment.find({ author: user._id })
            .populate('post', 'title')
            .sort({ createdAt: -1 })
            .lean();
        res.json(comments);
    }
);

// Get comments liked by the user
router.get(
    '/profile/comments/liked',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const user = (req as any).user;
        const userIdStr = user._id.toString();
        const comments = await Comment.find({
            likes: new Types.ObjectId(userIdStr)
        })
            .populate('post', 'title')
            .sort({ createdAt: -1 })
            .lean();
        res.json(comments);
    }
);

// Get comments disliked by the user
router.get(
    '/profile/comments/disliked',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const user = (req as any).user;
        const userIdStr = user._id.toString();
        const comments = await Comment.find({
            dislikes: new Types.ObjectId(userIdStr)
        })
            .populate('post', 'title')
            .sort({ createdAt: -1 })
            .lean();
        res.json(comments);
    }
);

// Delete a comment by ID if owned by user
router.delete(
    '/profile/comments/:id',
    isAuthAndVerifiedMiddleware,
    async (req: Request, res: Response) => {
        const user = (req as any).user;
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.author.toString() !== user._id.toString()) {
            return res
                .status(403)
                .json({ error: 'Not authorised to delete this comment' });
        }

        comment.deleted = true;
        comment.text = '[deleted]';
        await comment.save();

        res.json({ message: 'Comment deleted successfully', comment });
    }
);

// Request verification email (only need to be authenticated, not necessarily verified)
router.post(
    '/profile/verify-email',
    authMiddleware,
    async (req: Request, res: Response) => {
        const user = (req as any).user;

        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified' });
        }

        const tempToken: string = crypto
            .randomBytes(TOKEN_SIZE)
            .toString('hex');
        const tempTokenExpires: Date = new Date(
            Date.now() + TOKEN_VALIDITY_HOURS
        );

        user.tempToken = tempToken;
        user.tempTokenExpires = tempTokenExpires;
        await user.save();

        const timeStamp: string = new Date().toISOString();
        const magicLink: string = `${API_URL}/api/auth/magic-verify?token=${tempToken}`;
        await sendEmail(
            user.email,
            "Dereck's Notes | Verify Your Email",
            `Click the following link to verify your email: <a href="${magicLink}">${magicLink}</a><br><br>If you didn't request this, you can safely ignore this email.<br><br>${timeStamp}`
        );

        res.json({ message: 'Verification email sent' });
    }
);

export default router;
