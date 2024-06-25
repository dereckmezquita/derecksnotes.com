import { Router } from 'express';

import magicLink from './magic-link';
import password from './password';
import helpers from './helpers';
import userInfo from './user-info';

const router = Router();

router.use(magicLink);
router.use(password);
router.use(helpers);
router.use(userInfo);

export default router;
