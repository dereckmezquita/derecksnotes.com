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
        address: {
            type: String,
            unique: true,
            required: true,
            validate: {
                validator: function (v: string) {
                    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v);
                },
                message: (props: any) => `${props.value} is not a valid email!`
            }
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 25,
        validate: {
            validator: function (v: string) {
                const reserved: string[] = ['dereck2']
                return !reserved.includes(v.toLowerCase());
            },
            message: (props: any) => `${props.value} is a reserved username!`
        }
    },
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
        lastConnected: { type: Date, default: new Date() },
    }
});

// ---------------------------------------
// pre save hooks
// ---------------------------------------
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

// lowercase the username before saving
userSchema.pre('save', function (next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }

    next();
});

// ---------------------------------------
// virtuals
// ---------------------------------------
/*
console.log(comment.latestProfilePhoto);
*/
userSchema.virtual('latestProfilePhoto').get(function () {
    return this.profilePhotos[this.profilePhotos.length - 1];
});

// ---------------------------------------
// methods
// ---------------------------------------
/*
const user = await User.findById(someId);
console.log(user.isPasswordCorrect('somePassword'));
*/
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.model<UserInfo & mongoose.Document>('User', userSchema);

export default User;
