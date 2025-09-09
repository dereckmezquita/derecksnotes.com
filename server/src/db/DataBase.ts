import mongoose from 'mongoose';
import Redis, { type RedisOptions } from 'ioredis';
import * as env from '../utils/env';

class DataBases {
    private constructor() {}
    public mongoose?: typeof mongoose;
    public redisClient?: Redis;

    public get mongooseClient(): typeof mongoose {
        if (!this.mongoose) {
            throw new Error('MongoDB not connected');
        }
        return this.mongoose;
    }

    public get redis(): Redis {
        if (!this.redisClient) {
            throw new Error('Redis not connected');
        }
        return this.redisClient;
    }

    private async connectMongoDB() {
        try {
            const ip = env.MONGO_URI;
            const database: string = env.MONGO_DATABASE;

            const uri: string = `mongodb://admin:${env.MONGO_PASSWORD}@${ip}:27017/${database}?authSource=admin`;

            await mongoose.connect(uri);
            this.mongoose = mongoose;
            console.log(`Connected to MongoDB (${database})`);
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            throw error;
        }
    }

    private async connectRedis() {
        try {
            let redisConfig: RedisOptions;

            if (env.BUILD_ENV === 'LOCAL') {
                // Local development - connect to remote Redis with TLS
                redisConfig = {
                    host: env.REDIS_URI,
                    port: 6379,
                    // No password required - Redis authentication disabled
                    enableReadyCheck: true,
                    tls: {
                        rejectUnauthorized: true
                    }
                };
            } else {
                // DEV or PROD environment - running in Docker, use internal Docker network
                redisConfig = {
                    host: env.REDIS_URI, // This will be 'linode_dereck-redis'
                    // No password required - Redis authentication disabled
                    enableReadyCheck: true
                };
            }

            this.redisClient = new Redis(redisConfig);

            // Add event listeners for better debugging
            this.redisClient.on('connect', () => {
                console.log(`Redis client connected to ${env.REDIS_URI}`);
            });

            this.redisClient.on('ready', () => {
                console.log('Redis client ready for commands');
            });

            this.redisClient.on('reconnecting', () => {
                console.log('Redis client reconnecting');
            });

            this.redisClient.on('end', () => {
                console.log('Redis client connection closed');
            });

            this.redisClient.on('error', (error) => {
                console.error('Redis client error:', error);

                // For local development, provide more helpful error message
                if (env.BUILD_ENV === 'LOCAL') {
                    console.log(
                        'If running locally without Redis, consider setting up a local Redis instance or mocking it.'
                    );
                }
            });

            // Verify connection with ping
            await this.redisClient.ping();
            console.log('Connected to Redis');
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    public async disconnectMongoDB(): Promise<void> {
        if (this.mongoose) {
            await this.mongoose.disconnect();
            this.mongoose = undefined;
            console.log('Disconnected from MongoDB');
        }
    }

    public async disconnectRedis(): Promise<void> {
        if (this.redisClient) {
            await this.redisClient.quit();
            this.redisClient = undefined;
            console.log('Disconnected from Redis');
        }
    }

    public async disconnect(): Promise<void> {
        await Promise.all([this.disconnectMongoDB(), this.disconnectRedis()]);
    }

    public async connect(): Promise<void> {
        await Promise.all([this.connectMongoDB(), this.connectRedis()]);
    }

    static async initialise(): Promise<DataBases> {
        const db = new DataBases();
        await db.connect();
        return db;
    }
}

const db = await DataBases.initialise();

export { DataBases, db };
