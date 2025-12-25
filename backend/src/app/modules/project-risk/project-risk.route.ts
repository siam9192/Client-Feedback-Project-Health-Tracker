import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import projectRiskController from './project-risk.controller';

const router = Router();
router.post('/', auth(UserRole.EMPLOYEE), projectRiskController.createRisk);

router.get('/', auth(UserRole.ADMIN), projectRiskController.getRisks);

const projectRiskRouter = router;

export default projectRiskRouter;
