import { Router } from 'express';
import auth from '../../middlewares/auth';
import authController from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import authValidations from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(authValidations.userRegistrationSchema),
  authController.register,
);

router.post(
  '/login',
  validateRequest(authValidations.userLoginSchema),
  authController.login,
);

router.post('/logout', authController.logout);

router.patch(
  '/change-password',
  auth(),
  validateRequest(authValidations.changePasswordSchema),
  authController.changePassword,
);

router.get('/access-token', authController.getNewAccessToken);

const authRouter = router;

export default authRouter;
