import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
    _id?: string;
    firstName: string;
    lastName?: string;
    username: string;
    email: string;
    password?: string;
    isVerified: boolean;
    profilePhoto: string; // name we build path; saved in public/uploads
    createdAt: Date;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: Date;
    apiKey?: string;
    tempToken?: string;
    tempTokenExpires?: Date;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    role: 'user' | 'admin';
    preferences?: {
        emailNotifications: boolean;
        theme: 'light' | 'dark' | 'system';
    };

    // Methods
    comparePassword(password: string): Promise<boolean>;
    incrementLoginAttempts(): Promise<void>;
    resetLoginAttempts(): Promise<void>;
    isLocked(): boolean;
}

export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    findByApiKey(apiKey: string): Promise<IUser | null>;
    findByResetPasswordToken(token: string): Promise<IUser | null>;
    findByVerificationToken(token: string): Promise<IUser | null>;
    findByTempToken(token: string): Promise<IUser | null>;
}

// Username validation
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{2,25}$/;
const RESERVED_USERNAMES = [
    'admin',
    'root',
    'administrator',
    'superuser',
    'user',
    'system',
    'moderator',
    'support',
    'help',
    'dereck',
    'derecksnotes'
];

const UserSchema: Schema<IUser> = new Schema({
    firstName: {
        type: String,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 25,
        trim: true,
        validate: [
            {
                validator: function (v: string) {
                    return USERNAME_REGEX.test(v);
                },
                message:
                    'Username can only contain letters, numbers, underscores, dots and hyphens'
            },
            {
                validator: function (v: string) {
                    return !RESERVED_USERNAMES.includes(v.toLowerCase());
                },
                message: (props) => `${props.value} is a reserved username`
            }
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email address`
        }
    },
    password: {
        type: String,
        select: false // Don't include by default in queries
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        type: String,
        default: 'default.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true // Can't be changed after creation
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    apiKey: {
        type: String,
        unique: true,
        default: uuidv4,
        required: false,
        select: false // Don't include in queries by default
    },
    tempToken: {
        type: String,
        select: false
    },
    tempTokenExpires: {
        type: Date
    },
    verificationToken: {
        type: String,
        select: false
    },
    verificationTokenExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpires: {
        type: Date
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        }
    }
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ apiKey: 1 });
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ tempToken: 1 });

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Normalize username and email
UserSchema.pre('save', function (next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }

    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    if (!this.password) {
        // Handle magic link users who don't have a password
        return false;
    }
    return bcrypt.compare(password, this.password);
};

// Login attempt tracking methods
UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
    // Increment the login attempts and update the lock time if needed
    this.loginAttempts += 1;

    // If we've reached the max attempts, lock the account
    if (this.loginAttempts >= 5) {
        // Lock for 15 minutes
        this.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    await this.save();
};

UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    await this.save();
};

UserSchema.methods.isLocked = function (): boolean {
    return Boolean(this.lockUntil && this.lockUntil > new Date());
};

// Static methods for finding users
UserSchema.statics.findByEmail = async function (
    email: string
): Promise<IUser | null> {
    return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findByUsername = async function (
    username: string
): Promise<IUser | null> {
    return this.findOne({ username: username.toLowerCase() });
};

UserSchema.statics.findByApiKey = async function (
    apiKey: string
): Promise<IUser | null> {
    return this.findOne({ apiKey });
};

UserSchema.statics.findByResetPasswordToken = async function (
    token: string
): Promise<IUser | null> {
    return this.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
};

UserSchema.statics.findByVerificationToken = async function (
    token: string
): Promise<IUser | null> {
    return this.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() }
    });
};

UserSchema.statics.findByTempToken = async function (
    token: string
): Promise<IUser | null> {
    return this.findOne({
        tempToken: token,
        tempTokenExpires: { $gt: Date.now() }
    });
};

export const User: IUserModel = mongoose.model<IUser, IUserModel>(
    'User',
    UserSchema
);
