import { Router } from 'express';
import { MongoClient } from 'mongodb';

// ------------------------
import { getDefinitions, initGetDefinitions } from './routes/getDefinitions';
import { getEntries, initGetEntries } from './routes/getEntries';
import { getLikes, initGetLikes } from './routes/getLikes';
import { postLogin, initLogin } from './routes/postLogin';
import { postRegister, initRegister } from './routes/postRegister';
import { getUserInfo, initUserInfo } from './routes/getUserInfo';
import { postComment, initComment } from './routes/newComment';

export const router = Router();

router.use(getEntries, getLikes, getDefinitions, postRegister, postLogin, getUserInfo, postComment);

export const initDB = (client: MongoClient) => {
    initGetEntries(client);
    initGetDefinitions(client);
    initGetLikes(client);
    initRegister(client);
    initLogin(client);
    initUserInfo(client);
    initComment(client);
}