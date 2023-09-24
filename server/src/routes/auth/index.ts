import { Router } from 'express';

import login from './login';
import register from './register';
import logout from './logout';
import me from './me';

const authRoutes = Router();

authRoutes.use('/login', login);
authRoutes.use('/register', register);
authRoutes.use('/logout', logout);
authRoutes.use('/me', me);

export default authRoutes;