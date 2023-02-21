import { Router } from 'express';
import { MongoClient } from 'mongodb';

// ------------------------
import { getDefinitions, initGetDefinitions } from './routes/dictionaries/getDefinitions';
import { getArticles, initGetArticles } from './routes/articles/getArticles';
import { getLikes, initGetLikes } from './routes/articles/getLikes';
import { login, initLogin } from './routes/users/login';
import { register, initRegister } from './routes/users/register';
import { getUserInfo, initUserInfo } from './routes/users/getUserInfo';
import { postComment, initComment } from './routes/articles/newComment';
import { getComments, initGetComments } from './routes/articles/getComments';
import { logout } from './routes/users/logout';

export const router = Router();

router.use(
    getArticles,
    getLikes,
    getDefinitions,
    register,
    login,
    getUserInfo,
    postComment,
    getComments,
    logout
);

export const initDB = (client: MongoClient) => {
    initGetArticles(client);
    initGetDefinitions(client);
    initGetLikes(client);
    initRegister(client);
    initLogin(client);
    initUserInfo(client);
    initComment(client);
    initGetComments(client);
}