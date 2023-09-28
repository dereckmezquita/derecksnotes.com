import { Router } from 'express';

import new_comment from './new_comment';

const interactRoutes = Router();

interactRoutes.use('/', new_comment);

export default interactRoutes;