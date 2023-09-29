import { Router } from 'express';

import new_comment from './new_comment';
import get_article_comments from './get_article_comments';

const interactRoutes = Router();

interactRoutes.use('/', new_comment);
interactRoutes.use('/', get_article_comments);

export default interactRoutes;