import { Router } from 'express';
import { jwt } from '../middlewares/index.js';

import auth from './RouteAuth.js';
import loonbrieven from './RouteLoonbrieven.js';
import users from './RouteUsers.js';

const router = new Router();

router.use('/auth', auth);
router.use('/loonbrieven', jwt.verifyAccessToken, loonbrieven);
router.use('/users', jwt.verifyAdminToken, users)

export default router;
