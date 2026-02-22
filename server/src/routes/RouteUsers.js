import { Router } from 'express';
import { users } from '../controllers/index.js';
import { jwt } from '../middlewares/index.js';

const router = Router();

router.get('/', [jwt.verifyAdminToken], users.get);
// router.get('/:email/', [jwt.verifyAdminToken], users.getByEmail);

export default router;
