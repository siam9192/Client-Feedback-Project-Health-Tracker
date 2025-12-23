import { Router } from 'express';
import userController from './user.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/me', auth(), userController.getCurrentUser);

router.get('/:id', userController.getUserById);

router.get('/role/employees', userController.getEmployees);
router.get('/role/clients', userController.getEmployees);

const userRouter = router;

export default userRouter;
