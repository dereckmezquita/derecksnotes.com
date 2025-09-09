import { Router, type Request, type Response } from 'express';
import { User, type IUser } from '../../db/models/User';
import { Comment, type IComment } from '../../db/models/Comment';
import { authMiddleware, isAdminMiddleware } from '../../middleware/isAuth';

const router = Router();

/**
 * Get current user information
 * GET /api/auth/user-info
 */
router.get(
    '/auth/user-info',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            // req.user is already set by authMiddleware
            const user = req.user as IUser;

            // Touch the session to keep it alive and save any changes
            req.session.touch();

            // Return user information after ensuring session is saved
            return req.session.save((err) => {
                if (err) {
                    console.error('Error saving session in user-info:', err);
                    return res.status(500).json({
                        error: 'An error occurred',
                        code: 'SERVER_ERROR'
                    });
                }

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
                        createdAt: user.createdAt,
                        lastLogin: user.lastLogin,
                        preferences: user.preferences
                    }
                });
            });
        } catch (error) {
            console.error('Error getting user info:', error);
            res.status(500).json({
                error: 'An error occurred',
                code: 'SERVER_ERROR'
            });
        }
    }
);

/**
 * Update current user profile
 * PUT /api/auth/profile
 */
router.put(
    '/auth/profile',
    authMiddleware,
    async (req: Request, res: Response) => {
        const { firstName, lastName, username } = req.body;
        const user = req.user as IUser;

        try {
            // Validate username if it's being changed
            if (username && username !== user.username) {
                // Check username format
                if (!/^[a-zA-Z0-9_.-]{2,25}$/.test(username)) {
                    return res.status(400).json({
                        error: 'Username can only contain letters, numbers, underscores, dots and hyphens',
                        code: 'INVALID_USERNAME'
                    });
                }

                // Check if username is already taken
                const existingUser = await User.findOne({
                    username: username.toLowerCase(),
                    _id: { $ne: user._id } // exclude current user
                });

                if (existingUser) {
                    return res.status(400).json({
                        error: 'Username is already taken',
                        code: 'USERNAME_TAKEN'
                    });
                }
            }

            // Update user profile
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (username) user.username = username;

            await user.save();

            res.json({
                message: 'Profile updated successfully',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    isVerified: user.isVerified,
                    profilePhoto: user.profilePhoto,
                    role: user.role,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin,
                    preferences: user.preferences
                }
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({
                error: 'An error occurred',
                code: 'SERVER_ERROR'
            });
        }
    }
);

/**
 * Update user preferences
 * PUT /api/auth/preferences
 */
router.put(
    '/auth/preferences',
    authMiddleware,
    async (req: Request, res: Response) => {
        const { theme, emailNotifications } = req.body;
        const user = req.user as IUser;

        try {
            // Initialize preferences object if it doesn't exist
            if (!user.preferences) {
                user.preferences = {
                    theme: 'system',
                    emailNotifications: true
                };
            }

            // Update preferences
            if (theme && ['light', 'dark', 'system'].includes(theme)) {
                user.preferences.theme = theme as 'light' | 'dark' | 'system';
            }

            if (typeof emailNotifications === 'boolean') {
                user.preferences.emailNotifications = emailNotifications;
            }

            await user.save();

            res.json({
                message: 'Preferences updated successfully',
                preferences: user.preferences
            });
        } catch (error) {
            console.error('Error updating preferences:', error);
            res.status(500).json({
                error: 'An error occurred',
                code: 'SERVER_ERROR'
            });
        }
    }
);

/**
 * Get user activity (comments)
 * GET /api/auth/activity
 */
router.get(
    '/auth/activity',
    authMiddleware,
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        try {
            // Find user's comments (using author field from Comment model)
            const comments = await Comment.find({ author: userId })
                .sort({ createdAt: -1 })
                .limit(20)
                .populate('post', 'title slug');

            res.json({
                activity: {
                    comments: comments.map((comment) => ({
                        id: comment._id,
                        content: comment.text, // Using text field from Comment model
                        createdAt: comment.createdAt,
                        post: comment.post
                            ? {
                                  id: comment.post._id,
                                  title: (comment.post as any).title,
                                  slug: (comment.post as any).slug
                              }
                            : null
                    }))
                }
            });
        } catch (error) {
            console.error('Error getting user activity:', error);
            res.status(500).json({
                error: 'An error occurred',
                code: 'SERVER_ERROR'
            });
        }
    }
);

/**
 * Admin: Get user list (admin only)
 * GET /api/auth/admin/users
 */
router.get(
    '/auth/admin/users',
    authMiddleware,
    isAdminMiddleware,
    async (req: Request, res: Response) => {
        try {
            const users = await User.find({})
                .select(
                    'firstName lastName username email isVerified role createdAt lastLogin'
                )
                .sort({ createdAt: -1 });

            res.json({
                users: users.map((user) => ({
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    isVerified: user.isVerified,
                    role: user.role,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                }))
            });
        } catch (error) {
            console.error('Error getting user list:', error);
            res.status(500).json({
                error: 'An error occurred',
                code: 'SERVER_ERROR'
            });
        }
    }
);

export default router;
