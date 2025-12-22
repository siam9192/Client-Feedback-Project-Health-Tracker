import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorInterface, ErrorSource } from '../types/error.type';
import envConfig from '../config/env.config';
import AppError from './AppError';

export const handleZodValidationError = (err: ZodError): ErrorInterface => {
  const statusCode = 400;

  const errorMessages = err.issues.map((issue) => ({
    path: issue.path.length ? String(issue.path[issue.path.length - 1]) : '',
    message: issue.message,
  }));

  return { statusCode, message: err.message, errorMessages };
};

export function GlobalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('This is error', err);
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: ErrorSource[] = [
    { path: '', message: 'Something went wrong' },
  ];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [];
  }

  if (err instanceof ZodError) {
    const errHandler = handleZodValidationError(err);
    statusCode = errHandler.statusCode;
    message = errHandler.message;
    errorMessages = errHandler.errorMessages;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack:
      envConfig.environment?.toLocaleLowerCase() === 'development'
        ? err?.stack
        : null,
  });
}
