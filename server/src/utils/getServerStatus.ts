import fs from 'fs';
import path from 'path';

import * as env from './env';
import { db } from '../db/DataBase';

const VERSION: string = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf-8')
).version;

export async function getServerStatus() {
    const mongoStatus =
        db.mongoose?.connection.readyState === 1 ? 'connected' : 'disconnected';
    let redisStatus = 'disconnected';
    try {
        await db.redis.ping();
        redisStatus = 'connected';
    } catch (error) {
        console.error('Redis ping failed:', error);
    }

    return {
        name: "Dereck's Notes API",
        ok: true,
        version: VERSION,
        build: env.BUILD_ENV,
        datetime: new Date().toISOString(),
        buildTime: buildTime,
        databases: {
            mongodb: mongoStatus,
            redis: redisStatus
        }
    };
}

const buildTime = new Date().toISOString();
