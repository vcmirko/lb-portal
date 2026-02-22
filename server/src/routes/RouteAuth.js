import { Router } from 'express';
import { auth } from '../controllers/index.js';
import { jwt } from '../middlewares/index.js';

const router = Router();

router.get('/user', [jwt.verifyAccessToken], auth.getCurrentUser);
router.post('/login', auth.validate('login'), auth.login);
router.post('/register', auth.validate('register'), auth.register);
router.post('/lostPassword', auth.validate('register'), auth.lostPassword);
router.post('/changePassword', auth.validate('verify'), auth.changePassword);


export default router;
