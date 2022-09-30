import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { initGetDefinitions } from './routes/getDefinitions';

import { getEntries, initGetEntries } from './routes/getEntries';
import { getLikes, initGetLikes } from './routes/getLikes';

export const router = Router();

router.use(getEntries, getLikes);

export const initDB = (client: MongoClient) => {
    initGetDefinitions(client);
    initGetEntries(client);
    initGetLikes(client);
}