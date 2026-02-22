import { Router } from 'express';
import { loonbrieven } from '../controllers/index.js';
import { jwt } from '../middlewares/index.js';

const router = Router();

router.get('/', [jwt.verifyAccessToken], loonbrieven.get);
router.get('/:subfolder/:year/:filename', [jwt.verifyAccessToken], loonbrieven.getByName);


export default router;
