import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';

// ------------------------
import { getDefinitions, initGetDefinitions } from './routes/getDefinitions';
import { getEntries, initGetEntries } from './routes/getEntries';
import { getLikes, initGetLikes } from './routes/getLikes';
import { postLogin, initLogin } from './routes/postLogin';

export const router = Router();

router.use(getEntries, getLikes, getDefinitions, postLogin);

export const initDB = (client: MongoClient) => {
    initGetEntries(client);
    initGetDefinitions(client);
    initGetLikes(client);
    initLogin(client);
}