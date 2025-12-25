import { Router } from 'express';
import userController from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from './user.interface';

const router = Router();

router.get('/me', auth(), userController.getCurrentUser);

router.get('/employees', userController.getEmployees);

router.get('/clients', userController.getEmployees);

router.get('/:id', auth(UserRole.ADMIN), userController.getUserById);

const userRouter = router;

export default userRouter;
