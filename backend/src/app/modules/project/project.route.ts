import { Router } from 'express';
import projectController from './project.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';

const router = Router();

router.post('/projects', projectController.createProject);

router.get(
  '/projects/assigned',
  auth(UserRole.EMPLOYEE, UserRole.CLIENT),
  projectController.getAssignedProjects,
);

router.get(
  '/projects/group-by-status',
  auth(UserRole.EMPLOYEE, UserRole.CLIENT),
  projectController.getAllGroupProjectsByHealthStatus,
);

const projectRouter = router;

export default projectRouter;
