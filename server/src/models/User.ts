import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    profilePhoto: String,
    email: {
        address: { type: String, unique: true },
        verified: Boolean
    },
    username: { type: String, unique: true },
    password: { type: String, required: true },
    metadata: {
        geoLocations: [{
            ip: String,
            country: String,
            countryCode: String,
            flag: String,
            regionName: String,
            city: String,
            isp: String,
            org: String,
            firstUsed: Date,
            lastUsed: Date
        }],
        lastConnected: Date,
        numberOfComments: Number,
        commentsJudged: [{
            commentId: String,
            judgement: { type: String, enum: ['like', 'dislike'] }
        }]
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);

    if (this.isModified('password') && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

const User = mongoose.model<UserInfo & mongoose.Document>('User', userSchema);

export default User;
