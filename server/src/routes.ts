import { Router } from 'express';
import { MongoClient } from 'mongodb';

// ------------------------
import { getDefinitions, initGetDefinitions } from './routes/dictionaries/getDefinitions';
import { getEntries, initGetEntries } from './routes/articles/getEntries';
import { getLikes, initGetLikes } from './routes/articles/getLikes';
import { postLogin, initLogin } from './routes/users/postLogin';
import { postRegister, initRegister } from './routes/users/postRegister';
import { getUserInfo, initUserInfo } from './routes/users/getUserInfo';
import { postComment, initComment } from './routes/comments/newComment';

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