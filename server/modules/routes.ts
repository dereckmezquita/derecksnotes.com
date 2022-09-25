import { Router, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';

import { getEntries, initGetEntries } from './routes/getEntries';
import { getLikes, initGetLikes } from './routes/getLikes';

export const router = Router();

router.use(getEntries, getLikes);

export const initDB = (client: MongoClient) => {
    initGetEntries(client);
    initGetLikes(client);
}