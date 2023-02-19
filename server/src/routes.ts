import { Router } from 'express';
import { MongoClient } from 'mongodb';

// ------------------------
import { getDefinitions, initGetDefinitions } from './routes/dictionaries/getDefinitions';
import { getArticles, initGetArticles } from './routes/articles/getArticles';
import { getLikes, initGetLikes } from './routes/articles/getLikes';
import { login, initLogin } from './routes/users/login';
import { postRegister, initRegister } from './routes/users/postRegister';
import { getUserInfo, initUserInfo } from './routes/users/getUserInfo';
import { postComment, initComment } from './routes/comments/newComment';

export const router = Router();

router.use(
    getArticles,
    getLikes,
    getDefinitions,
    postRegister,
    login,
    getUserInfo,
    postComment
);

export const initDB = (client: MongoClient) => {
    initGetArticles(client);
    initGetDefinitions(client);
    initGetLikes(client);
    initRegister(client);
    initLogin(client);
    initUserInfo(client);
    initComment(client);
}