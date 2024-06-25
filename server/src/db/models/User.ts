import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
    _id?: string;
    firstName: string;
    lastName?: string;
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    profilePhoto: string; // name we build path; saved in public/uploads
    apiKey?: string;
    tempToken?: string;
    tempTokenExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    role?: 'user' | 'admin';
    comparePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    findByApiKey(apiKey: string): Promise<IUser | null>;
    findByResetPasswordToken(token: string): Promise<IUser | null>;
}

const UserSchema: Schema<IUser> = new Schema({
    firstName: { type: String },
    lastName: { type: String, required: false },
    username: {
        type: String,
        unique: true,
        minlength: 2,
        maxlength: 25,
        validate: {
            validator: function (v: string) {
                const reserved: string[] = [
                    'dereck',
                    'dereck2',
                    'admin',
                    'root',
                    'administrator',
                    'superuser',
                    'user'
                ];
                return !reserved.includes(v.toLowerCase());
            },
            message: (props: any) => `${props.value} is a reserved username`
        }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    profilePhoto: { type: String, default: 'default.jpg' },
    apiKey: { type: String, unique: true, default: uuidv4, required: false },
    tempToken: { type: String },
    tempTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.pre('save', function (next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }

    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }
    next();
});

UserSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.findByEmail = async function (
    email: string
): Promise<IUser | null> {
    return this.findOne({ email });
};

UserSchema.statics.findByUsername = async function (
    username: string
): Promise<IUser | null> {
    return this.findOne({ username });
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

export const User: IUserModel = mongoose.model<IUser, IUserModel>(
    'User',
    UserSchema
);
