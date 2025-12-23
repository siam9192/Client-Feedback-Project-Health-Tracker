import z from 'zod';
import envConfig from '../../config/env.config';
import jwtHelper from '../../helpers/jwt.helper';
import { prisma } from '../../prisma';
import userService from '../user/user.service';
import {
  ChangePasswordPayload,
  UserLoginPayload,
  UserRegistrationPayload,
} from './auth.interface';
import AppError from '../../errors/AppError';
import httpStatus from '../../utils/http-status';
import bcryptHelper from '../../helpers/bycrypt.helper';
import { AuthUser } from '../../types';
import userRepository from '../user/user.repository';

class AuthService {
  async login(payload: UserLoginPayload) {
    const { identifier, password } = payload;
    const isEmailProvided = z
      .email(payload.identifier)
      .safeParse(payload.identifier).success;

    const user = await prisma.user.findUnique({
      where: {
        ...(isEmailProvided ? { email: identifier } : { username: identifier }),
      },
      select: { id: true, password: true },
    });

    // Compare password
    const isPasswordValid =
      user && (await bcryptHelper.compare(password, user.password));

    if (!user || !isPasswordValid) {
      throw new AppError(httpStatus.FORBIDDEN, 'Invalid email or password');
    }

    const tokenPayload = { id: user.id };

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

  async changePassword(authUser: AuthUser, payload: ChangePasswordPayload) {
    const user = await prisma.user.findUnique({ where: { id: authUser.id } });

    if (!user) throw new Error();
    // Compare old password
    const isPasswordMatch = await bcryptHelper.compare(
      payload.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        'Incorrect current password.',
      );
    }
    // Hash the new password
    const newEncryptedPassword = bcryptHelper.hash(payload.newPassword);

    // Update user password and passwordLastChangedAt
    await userRepository.updateById(authUser.id, {
      password: newEncryptedPassword,
      passwordLastChangedAt: new Date(),
    });

    const tokenPayload = { id: user.id };

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
