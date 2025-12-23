import envConfig from '../../config/env.config';
import jwtHelper from '../../helpers/jwt.helper';
import { UserLoginPayload } from './auth.interface';
import AppError from '../../errors/AppError';
import httpStatus from '../../utils/http-status';
import bcryptHelper from '../../helpers/bycrypt.helper';
import { AuthUser } from '../../types';
import { UserModel } from '../user/user.model';
import authValidations from './auth.validation';
import { UserStatus } from '../user/user.interface';

class AuthService {
  async login(payload: UserLoginPayload) {
    //  Validate payload  throw error when invalid
    payload = authValidations.loginSchema.parse(payload);

    const { email, password } = payload;

    const user = await UserModel.findOne({
      email,
    }).select('password profileId');

    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'Account not found');

    if (user.status === UserStatus.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked');
    }

    // Compare password
    const isPasswordValid =
      user && (await bcryptHelper.compare(password, user.password));

    if (!user || !isPasswordValid) {
      throw new AppError(httpStatus.FORBIDDEN, 'Invalid email or password');
    }

    const tokenPayload = { id: user._id.toString(), profileId: user.profileId };

    // Generate access token
    const accessToken = jwtHelper.generateToken(
      tokenPayload,
      envConfig.jwt.access_token_secret as string,
      envConfig.jwt.access_token_expire as string,
    );
    // Generate refresh token
    const refreshToken = jwtHelper.generateToken(
      tokenPayload,
      envConfig.jwt.refresh_token_secret as string,
      envConfig.jwt.refresh_token_expire as string,
    );

    return { accessToken, refreshToken };
  }

  async getNewAccessToken(oldRefreshToken: string) {
    try {
      if (!oldRefreshToken) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Refresh token is required.',
        );
      }

      let decoded;
      try {
        // Step 2: Verify and decode the token
        decoded = jwtHelper.verifyToken(
          oldRefreshToken,
          envConfig.jwt.refresh_token_secret as string,
        ) as AuthUser;

        if (!decoded || !decoded.id) {
          throw new Error();
        }
      } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token.');
      }
      const tokenPayload = { id: decoded.id };

      // Generate access token
      const accessToken = jwtHelper.generateToken(
        tokenPayload,
        envConfig.jwt.access_token_secret as string,
        envConfig.jwt.access_token_expire as string,
      );
      // Generate refresh token
      const refreshToken = jwtHelper.generateToken(
        tokenPayload,
        envConfig.jwt.refresh_token_secret as string,
        envConfig.jwt.refresh_token_expire as string,
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid or expired refresh token.',
      );
    }
  }
}

export default new AuthService();
