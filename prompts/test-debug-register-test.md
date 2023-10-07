Please find the mistake, we're running into timeout when I run the test for the register end point. However when I run a real registration from the front end to the server end point register it works well with no issues. Running it in a jest test using the in memory database is what's causing issues.

GlobalSetup.ts:

```ts
import { InMemoryDBConnector } from '../utils/DatabaseConnector';

export default async (): Promise<void> => {
    (global as any).dbConnector = new InMemoryDBConnector();
    await (global as any).dbConnector.connect();
    console.log('Connected to in-memory database');
};
```

globalTeardown.ts
```ts
export default async (): Promise<void> => {
    await (global as any).dbConnector.disconnect();
};
```

jest.config.ts:

```ts
...
  globalSetup: './src/tests/globalSetup.ts',

  // A path to a module which exports an async function that is triggered once after all test suites
  globalTeardown: './src/tests/globalTeardown.ts',
...
```

The end point register.ts:

```ts
import { Router } from 'express';
import mongoose from 'mongoose';

import User, { UserDocument } from '@models/User';

const register = Router();

declare module 'express-session' {
    interface SessionData {
        userId: string;
        username: string;
    }
}

register.post('/register', async (req, res) => {
    console.log("Received Registration Request:", req.body);

    try {
        const { email, username, password } = req.body;

        const userExists = await User.findOne<UserDocument>({ $or: [{ 'email.address': email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser: UserDocument = new User({
            email: {
                address: email,
                verified: false
            },
            username,
            password,
            metadata: {
                lastConnected: new Date()
            }
        });

        const ip_address = req.headers['x-forwarded-for'] as string;

        await newUser.addOrUpdateGeoLocation(ip_address); // saves the user

        await newUser.save();

        // create session
        req.session.userId = newUser._id;
        req.session.username = newUser.username;

        res.status(201).json({ message: "User registered and logged in successfully" });
    } catch (error: any) {
        console.error("Registration Error:", error);

        // return mongoose error if there is one
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                error: "Validation Error",
                message: Object.values(error.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({ message: "Server Error" });
    }
});

export default register;
```

The schema for user:
```ts
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

UserSchema.methods.addOrUpdateGeoLocation = async function(this: UserDocument, ip: string) {
    // Check if IP exists in geolocations.
    const geoLocationIndex = this.metadata.geolocations.findIndex((geo) => geo.ip === ip);

    if (geoLocationIndex !== -1) {
        // IP exists, so we update the lastUsed timestamp.
        this.metadata.geolocations[geoLocationIndex].lastUsed = new Date();
    } else {
        // IP doesn't exist, fetch the geolocation data.
        const newGeoLocation = await geoLocate(ip);
        
        // Add current date as firstUsed and lastUsed.
        newGeoLocation.firstUsed = new Date();
        newGeoLocation.lastUsed = new Date();

        // Push to geolocations array.
        this.metadata.geolocations.push(newGeoLocation as any);
    }

    // Save the updated user document.
    return this.save();
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
    addOrUpdateGeoLocation(ip: string): Promise<UserDocument>;
}

// User Model Interface
export interface UserModel extends Model<UserDocument> {
    // You can add static methods here if needed in the future.
}

// Now, we create the User model.
const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export default User;
```

The test:
```ts
import request from 'supertest';
import { SetUp, app, redisClient } from '../../../index';

import { API_PREFIX } from '@utils/constants';

jest.mock('redis', () => {
    const redisMock = require('redis-mock');
    const originalCreateClient = redisMock.createClient;

    redisMock.createClient = () => ({
        ...originalCreateClient(),
        connect: jest.fn().mockResolvedValue(undefined),
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(undefined),
    });

    return redisMock;
});

jest.mock('@utils/geoLocate', () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue({
        ip: '127.0.0.1',
        country: 'United States',
        countryCode: 'US',
        flag: '🇺🇸',
        regionName: 'California',
        city: 'San Francisco',
        isp: 'ISP_NAME',
        org: 'ORG_NAME'
    }),
}));

describe('POST /auth/register', () => {
    beforeAll(async () => {
        await SetUp();
    });

    afterAll(async () => {
        await redisClient.disconnect();
    });
    
    it('should successfully register a new user', async () => {
        const payload = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'testpassword',
        };

        const res = await request(app)
            .post(API_PREFIX + '/auth/register')
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User registered and logged in successfully');
    }, 10000);

    it('should fail if the user already exists', async () => {
        const payload = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'testpassword',
        };

        // First, register the user
        await request(app)
            .post(`${API_PREFIX}/auth/register`)
            .send(payload);

        // Try to register the same user again
        const res = await request(app)
            .post(`${API_PREFIX}/auth/register`)
            .send(payload);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('User already exists.');
    }, 10000);
});
```

The index.ts with the app:

```ts
import 'module-alias/register'; // allow for @ imports

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts, createClient } from 'redis';
import makeRedisStore from 'connect-redis';

import { authRoutes, uploadRoutes, interactRoutes } from './routes/index';
import { API_PREFIX } from '@utils/constants';
import { DatabaseConnector, MongoDBConnector } from '@utils/DatabaseConnector';

dotenv.config({ path: '../.env' });
const PORT: number = 3001;

// ----------------------------------------
// Setup Redis client and session store
export const redis_options: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> = {
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    url: 'redis://localhost:6379',
    legacyMode: true
};

export const redisClient = createClient(redis_options);

const redisStore = makeRedisStore(session);
// ----------------------------------------
export const app = express();

if (process.env.NODE_ENV === 'development') {
    // assuming frontend on port 3000
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
}

app.use(express.json());


export async function SetUp(dbConnector?: DatabaseConnector): Promise<void> {
    if (dbConnector) {
        await dbConnector.connect();
    }

    // ----------------------------------------
    await redisClient.connect();

    app.use(
        session({
            store: new redisStore({ client: redisClient }),
            secret: process.env.SESSION_SECRET || 'secret$%^134', // store secret in env var
            resave: false, // forces session be saved back to the session store, even if the session was never modified during the request
            saveUninitialized: false,
            cookie: {
                secure: false, // process.env.NODE_ENV === 'production', // HTTPS in production
                httpOnly: false, // true, // cookie inaccessible from JavaScript running in the browser
                // days * hours * minutes * seconds * milliseconds
                maxAge: 30 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
            }
        })
    );

    console.log('Ready to accept requests...');

    // ----------------------------------------
    app.use((req, res, next) => {
        console.log('Incoming request:', req.method, req.url);
        next();
    });

    // ----------------------------------------
    // Routes
    app.use(API_PREFIX + '/auth', authRoutes);

    app.use(API_PREFIX + '/upload', uploadRoutes);

    app.use(API_PREFIX + '/interact', interactRoutes);

    app.get(API_PREFIX + '/hello', (req, res) => {
        res.send('Hello World!');
    });
}

export async function main(): Promise<void> {
    const dbConnector = new MongoDBConnector(process.env.MONGO_URI!);

    await SetUp(dbConnector);

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

// If this file is being run directly (not imported somewhere else), start the server
if (require.main === module) {
    main().catch(err => {
        console.error('Error starting server:', err);
    });
}

export default app;
```