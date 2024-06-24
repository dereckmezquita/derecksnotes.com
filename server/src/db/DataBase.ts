import mongoose from 'mongoose';
import * as env from '../utils/env';

class DataBases {
    private constructor() {}
    public mongoose?: typeof mongoose;

    public get mongooseClient(): typeof mongoose {
        if (!this.mongoose) {
            throw new Error('MongoDB not connected');
        }

        return this.mongoose;
    }

    private async connectMongoDB() {
        try {
            const ip = env.MONGO_URI;
            const database: string = env.BUILD_ENV_BOOL
                ? 'prod_derecksnotes'
                : 'dev_derecksnotes';

            const uri: string = `mongodb://admin:${env.MONGO_PASSWORD}@${ip}:27017/${database}?authSource=admin`;

            await mongoose.connect(uri);
            this.mongoose = mongoose;
            console.log(`Connected to MongoDB (${database})`);
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
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

    public async disconnect(): Promise<void> {
        await this.disconnectMongoDB();
    }

    static async initialise(): Promise<DataBases> {
        const db = new DataBases();
        await db.connectMongoDB();
        return db;
    }
}

const db = await DataBases.initialise();

export { DataBases, db };
