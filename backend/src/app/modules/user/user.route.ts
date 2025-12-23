import { Router } from 'express';
import userController from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from './user.interface';


const router = Router();

router.get('/me', auth(), userController.getCurrentUser);

router.get('/employees', auth(UserRole.ADMIN), userController.getEmployees);
router.get('/clients', auth(UserRole.ADMIN), userController.getEmployees);

const userRouter = router;

export default userRouter;
