import { Router } from 'express';
import auth from '../../middlewares/auth';
import employeeCheckInController from './employeeCheckIn.controller';
import { UserRole } from '../user/user.interface';

const router = Router();
router.post(
  '/',
  auth(UserRole.EMPLOYEE),
  employeeCheckInController.createProject,
);

router.get(
  '/pending',
  auth(UserRole.EMPLOYEE),
  employeeCheckInController.getPendingCheckIns,
);

const employeeCheckInRouter = router;

export default employeeCheckInRouter;
