import { Router } from 'express';
import authController from './auth.controller';

const router = Router();

router.post('/login', authController.login);
router.get('/access-token', authController.getNewAccessToken);

const authRouter = router;

export default authRouter;
