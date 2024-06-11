import { Router } from 'express';

import profile_photo from './profile_photo';

const uploadRoutes = Router();

uploadRoutes.use('/', profile_photo);

export default uploadRoutes;
