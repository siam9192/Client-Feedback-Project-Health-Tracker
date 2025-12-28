import { Router } from 'express';
import projectController from './project.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import clientFeedbackController from '../client-feedback/client-feedback.controller';
import employeeCheckInController from '../employee-checkIn/employee-checkIn.controller';
import activityController from '../activity/activity.controller';
import { ALL_USER_ROLES } from '../../utils/constant';

const router = Router();

router.post('/', auth(UserRole.ADMIN), projectController.createProject);

router.get(
  '/assigned',
  auth(UserRole.EMPLOYEE, UserRole.CLIENT),
  projectController.getAssignedProjects,
);

router.get(
  '/health-groups',
  auth(UserRole.ADMIN),
  projectController.getAllGroupProjectsByHealthStatus,
);

router.get(
  '/health-group',
  auth(UserRole.ADMIN),
  projectController.getAllGroupProjectsByHealthStatus,
);

router.get(
  '/missing-checkins',
  auth(UserRole.ADMIN),
  projectController.getRecentCheckinMissingProjects,
);

router.get(
  '/high-risks',
  auth(UserRole.ADMIN),
  projectController.getHighRiskProjectsWithSummary,
);

router.get(
  '/:projectId',
  auth(...ALL_USER_ROLES),
  projectController.getProjectById,
);

router.get(
  '/:projectId/employee-feedbacks',
  auth(...ALL_USER_ROLES),
  clientFeedbackController.getFeedbacksByProjectId,
);

router.get(
  '/:projectId/employee-checkins',
  auth(...ALL_USER_ROLES),
  employeeCheckInController.getCheckInsByProjectId,
);

router.get(
  '/:projectId/activity-timelines',
  auth(...ALL_USER_ROLES),
  activityController.getActivitiesTimelineByProjectId,
);

const projectRouter = router;

export default projectRouter;
