import { Router } from 'express';

import login from './login';
import register from './register';
import logout from './logout';
import me from './me';

const authRoutes = Router();

authRoutes.use('/', login);
authRoutes.use('/', register);
authRoutes.use('/', logout);
authRoutes.use('/', me);

export default authRoutes;