import mongoose from 'mongoose';

export interface DatabaseConnector {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}

export class MongoDBConnector implements DatabaseConnector {
    private uri: string;

    constructor(uri: string) {
        this.uri = uri;
    }

    async connect() {
        try {
            await mongoose.connect(this.uri);
            console.log("MongoDB Connected!");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1);
        }
    }

    async disconnect() {
        await mongoose.connection.close();
    }
}

import { MongoMemoryServer } from 'mongodb-memory-server';

export class InMemoryDBConnector implements DatabaseConnector {
    private mongoServer: MongoMemoryServer;

    constructor() {
        this.mongoServer = new MongoMemoryServer();
    }

    async connect() {
        try {
            this.mongoServer = await MongoMemoryServer.create();
            const mongoUri = this.mongoServer.getUri('derecksnotes_test');
            const connection = await mongoose.connect(mongoUri);
            console.log("In-memory DB Connected!");
        } catch (error) {
            console.error("Error connecting to in-memory DB:", error);
            process.exit(1);
        }
    }

    async disconnect() {
        await mongoose.connection.close();
        await this.mongoServer.stop();
    }
}

export class NoOpDBConnector implements DatabaseConnector {
    async connect() {
        console.log("No-op DB connect");
    }

    async disconnect() {
        console.log("No-op DB disconnect");
    }
}