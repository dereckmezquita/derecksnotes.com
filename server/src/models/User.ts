import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import geoLocate from '@utils/geoLocate';

const UserSchema = new mongoose.Schema({
    name: {
        first: { type: String, default: null },
        last: { type: String, default: null }
    },
    profilePhotos: [{
        type: String,
        default: []
    }],
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
        geolocations: [
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
UserSchema.pre('save', async function (next) {
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
UserSchema.pre('save', function (next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }

    next();
});

// Sort geolocations by lastUsed date in ascending order (oldest first).
// .slice(-10) to get the last 10 geolocations used
UserSchema.pre('save', function (this: UserDocument, next) {
    this.metadata.geolocations.sort((a, b) => a.lastUsed.getTime() - b.lastUsed.getTime());

    next();
});

// ---------------------------------------
// virtuals
// ---------------------------------------
/*
console.log(comment.latestProfilePhoto);
*/
UserSchema.virtual('latestProfilePhoto').get(function () {
    return this.profilePhotos.length > 0 ? this.profilePhotos[this.profilePhotos.length - 1] : null;
});

// ---------------------------------------
// methods
// ---------------------------------------
/*
const user = await User.findById(someId);
console.log(user.isPasswordCorrect('somePassword'));
*/
UserSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.setAddOrUpdateGeoLocation = async function(this: UserDocument, ip: string): Promise<UserDocument> {
    // Check if IP exists in geolocations.
    const geoLocationIndex = this.metadata.geolocations.findIndex((geo) => geo.ip === ip);

    if (geoLocationIndex !== -1) {
        // IP exists, so we update the lastUsed timestamp using atomic operation.
        // using atomic operations to avoid concurrency issues with multiple requests
        await User.updateOne(
            { _id: this._id, "metadata.geolocations.ip": ip },
            { $set: { "metadata.geolocations.$.lastUsed": new Date() }}
        );
    } else {
        // IP doesn't exist, fetch the geolocation data.
        const newGeoLocation = await geoLocate(ip);
        
        // Add current date as firstUsed and lastUsed.
        newGeoLocation.firstUsed = new Date();
        newGeoLocation.lastUsed = new Date();

        // Push new geolocation data using atomic operation.
        await User.updateOne(
            { _id: this._id },
            { $push: { "metadata.geolocations": newGeoLocation }}
        );
    }

    // You might want to reload the user data if needed, since the current object is not updated.
    const updatedUser = await User.findById(this._id).exec();
    return updatedUser!;
};

// ---------------------------------------
// document interface
export interface UserDocument extends Document {
    name: {
        first: string | null;
        last: string | null;
    };
    profilePhotos: string[];
    email: {
        address: string;
        verified: boolean;
    };
    username: string;
    password: string;
    metadata: {
        geolocations: {
            ip: string;
            country: string;
            countryCode: string;
            flag: string;
            regionName: string;
            city: string;
            isp: string;
            org: string;
            firstUsed: Date;
            lastUsed: Date;
        }[];
        lastConnected: Date;
    };

    // Virtuals
    latestProfilePhoto: string | null;

    // Methods
    isPasswordCorrect(password: string): Promise<boolean>;
    setAddOrUpdateGeoLocation(ip: string): Promise<UserDocument>;
}

// User Model Interface
export interface UserModel extends Model<UserDocument> {
    // You can add static methods here if needed in the future.
}

// Now, we create the User model.
const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export default User;