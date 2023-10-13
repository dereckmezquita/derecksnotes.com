import { Router } from 'express';

import new_comment from './new_comment';
import get_article_comments from './get_article_comments';
import get_user_public_info from './get_user_public_info';
import get_comments_threads_by_id from './get_comments_threads_by_id';
import delete_comments from './delete_comments';
import edit_comment from './edit_comment';

const interactRoutes = Router();

interactRoutes.use('/', get_article_comments);
interactRoutes.use('/', get_user_public_info);
interactRoutes.use('/', get_comments_threads_by_id);

// auth protected routes
interactRoutes.use('/', new_comment);
interactRoutes.use('/', delete_comments);
interactRoutes.use('/', edit_comment);

export default interactRoutes;