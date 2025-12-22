import envConfig from '../../config/env.config';
import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/http-status';
import { sendSuccessResponse } from '../../utils/response';
import authService from './auth.service';
import parse from 'parse-duration';

class AuthController {
  register = catchAsync(async (req, res) => {
    const result = await authService.register(req.body);
    sendSuccessResponse(res, {
      message: 'Registration successful',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  });

  login = catchAsync(async (req, res) => {
    const result = await authService.login(req.body);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: envConfig.environment?.toLocaleLowerCase() === 'production',
      sameSite:
        envConfig.environment?.toLowerCase() === 'production' ? 'none' : 'lax',
      maxAge: parse(envConfig.jwt.access_token_expire as string) as number,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: envConfig.environment?.toLocaleLowerCase() === 'production',
      sameSite:
        envConfig.environment?.toLowerCase() === 'production' ? 'none' : 'lax',
      maxAge: parse(envConfig.jwt.refresh_token_expire as string) as number,
    });

    sendSuccessResponse(res, {
      message: 'Login successful',
      statusCode: httpStatus.OK,
      data: null,
    });
  });

  logout = catchAsync(async (req, res) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: envConfig.environment?.toLowerCase() === 'production',
      sameSite:
        envConfig.environment?.toLowerCase() === 'production' ? 'none' : 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: envConfig.environment?.toLowerCase() === 'production',
      sameSite:
        envConfig.environment?.toLowerCase() === 'production' ? 'none' : 'lax',
    });

    sendSuccessResponse(res, {
      message: 'Logout successful',
      statusCode: httpStatus.OK,
      data: null,
    });
  });

  changePassword = catchAsync(async (req, res) => {
    const result = await authService.changePassword(req.user, req.body);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: envConfig.environment?.toLocaleLowerCase() === 'production',
      sameSite:
        envConfig.environment?.toLowerCase() === 'production' ? 'none' : 'lax',
      maxAge: parse(envConfig.jwt.access_token_expire as string) as number,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: envConfig.environment?.toLocaleLowerCase() === 'production',
      sameSite:
        envConfig.environment?.toLowerCase() === 'production' ? 'none' : 'lax',
      maxAge: parse(envConfig.jwt.refresh_token_expire as string) as number,
    });

    sendSuccessResponse(res, {
      message: 'Password changed successfully',
      statusCode: httpStatus.OK,
      data: null,
    });
  });

  getNewAccessToken = catchAsync(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    const result = await authService.getNewAccessToken(refreshToken);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: envConfig.environment?.toLocaleLowerCase() === 'production',
      sameSite:
        envConfig.environment?.toLowerCase() === 'production' ? 'none' : 'lax',
      maxAge: parse(envConfig.jwt.access_token_expire as string) as number,
    });

    sendSuccessResponse(res, {
      message: 'New access token retrieved successfully',
      statusCode: httpStatus.OK,
      data: null,
    });
  });
}

export default new AuthController();
