import { IRouter, Router } from 'express';
import userRouter from '../modules/user/user.route';
import authRouter from '../modules/auth/auth.router';
import projectRouter from '../modules/project/project.route';

type TModuleRoutes = { path: string; router: IRouter }[];
const router = Router();
const moduleRoutes: TModuleRoutes = [
  { path: '/auth', router: authRouter },
  { path: '/users', router: userRouter },
  { path:'/projects',router:projectRouter}
];

const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;
