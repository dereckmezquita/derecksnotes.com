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
            if (env.BUILD_ENV === 'LOCAL') {
                this.redisClient = new Redis(env.REDIS_URI);
                console.log('Connected to Redis');
                return;
            }
            const redisConfig: RedisOptions = {
                host: env.REDIS_URI,
                enableReadyCheck: true
            };

            this.redisClient = new Redis(redisConfig);

            this.redisClient.on('error', (error) => {
                console.error('Redis client error:', error);

                // For local development, provide more helpful error message
                if (env.BUILD_ENV === 'LOCAL') {
                    console.log(
                        'If running locally without Redis, consider setting up a local Redis instance or mocking it.'
                    );
                }
            });

            console.log('Connected to Redis');
        } catch (error) {
            console.error('Failed to connect to Redis', error);
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
