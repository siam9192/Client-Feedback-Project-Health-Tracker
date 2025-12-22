import { IRouter, Router } from 'express';
import userRouter from '../modules/user/user.route';
import authRouter from '../modules/auth/auth.router';
import taskRouter from '../modules/task/task.route';
import notificationRouter from '../modules/notification/notification.route';
import metadataRouter from '../modules/metadata/metadata.router';

type TModuleRoutes = { path: string; router: IRouter }[];
const router = Router();
const moduleRoutes: TModuleRoutes = [
  { path: '/auth', router: authRouter },
  { path: '/users', router: userRouter },
  { path: '/tasks', router: taskRouter },
  { path: '/notifications', router: notificationRouter },
  { path: '/metadata', router: metadataRouter },
];

const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;
