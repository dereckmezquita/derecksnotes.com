import { Router } from 'express';

import new_comment from './new_comment';
import get_article_comments from './get_article_comments';
import get_user_public_info from './get_user_public_info';
import get_comments_by_array_of_ids from './get_comments_by_array_of_ids';
import delete_comments from './delete_comments';

const interactRoutes = Router();

interactRoutes.use('/', new_comment);
interactRoutes.use('/', get_article_comments);
interactRoutes.use('/', get_user_public_info);
interactRoutes.use('/', get_comments_by_array_of_ids);
interactRoutes.use('/', delete_comments);

export default interactRoutes;