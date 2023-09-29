import { Router } from 'express';

import new_comment from './new_comment';
import get_article_comments from './get_article_comments';
import get_user_public_info from './get_user_public_info';
import get_replies_comments from './get_replies_comments';

const interactRoutes = Router();

interactRoutes.use('/', new_comment);
interactRoutes.use('/', get_article_comments);
interactRoutes.use('/', get_user_public_info);
interactRoutes.use('/', get_replies_comments);

export default interactRoutes;