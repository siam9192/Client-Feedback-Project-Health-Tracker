import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from '../utils/http-status';
import AppError from '../errors/AppError';
import jwtHelper from '../helpers/jwt.helper';
import envConfig from '../config/env.config';
import { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../modules/user/user.model';
import { AuthUser } from '../modules/auth/auth.interface';
import { UserRole, UserStatus } from '../modules/user/user.interface';


function auth(...roles:UserRole[]) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken?.replace('Bearer ', '');

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    let decoded;

    try {
      decoded = jwtHelper.verifyToken(
        token,
        envConfig.jwt.access_token_secret as string,
      ) as AuthUser & JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    // checking if the user is exist
    const user = await UserModel.findById(decoded.userId)
   
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if the user is blocked
    if (user.status === UserStatus.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }
    
    // checking if the user role
    if(roles.length && !roles.includes(user.role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You have no access of this route');
    }

    req.user = decoded;

    next();
  });
}

export default auth;
