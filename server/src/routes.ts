import { Router } from 'express';
import { Db } from 'mongodb';

// ------------------------
import { get_definitions, init_get_definitions } from './routes/dictionaries/get_definitions';
import { get_articles, init_get_articles } from './routes/articles/get_articles';
import { login, init_login } from './routes/users/login';
import { register, init_register } from './routes/users/register';
import { get_user_info, init_get_user_info } from './routes/users/get_user_info';
import { new_comment, init_new_comment } from './routes/articles/new_comment';
import { get_comments, init_get_comments } from './routes/articles/get_comments';
import { get_comment_replies, init_get_comment_replies } from './routes/articles/get_comment_replies';
import { logout } from './routes/users/logout';
import { init_update_account_info, update_account_info } from './routes/users/update_account_info';

export const router = Router();

router.use(
    get_articles,
    get_definitions,
    register,
    login,
    get_user_info,
    new_comment,
    get_comments,
    get_comment_replies,
    logout,
    update_account_info
);

export const initDB = (client: Db) => {
    init_get_articles(client);
    init_get_definitions(client);
    init_register(client);
    init_login(client);
    init_get_user_info(client);
    init_new_comment(client);
    init_get_comments(client);
    init_get_comment_replies(client);
    init_update_account_info(client);
}