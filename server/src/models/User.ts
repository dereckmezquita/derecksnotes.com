import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        first: { type: String, default: null },
        last: { type: String, default: null }
    },
    profilePhotos: {
        type: [String],
        default: []
    },
    email: {
        address: { type: String, unique: true, required: true },
        verified: Boolean
    },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    metadata: {
        geoLocations: [
            {
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
            }
        ],
        lastConnected: { type: Date, default: Date.now },
        numberOfComments: { type: Number, default: 0 },
        commentsJudged: {
            type: [{
                commentId: String,
                judgement: { type: String, enum: ['like', 'dislike'] }
            }],
            default: []
        }
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    if (this.isModified('password') && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

const User = mongoose.model<UserInfo & mongoose.Document>('User', userSchema);

export default User;
