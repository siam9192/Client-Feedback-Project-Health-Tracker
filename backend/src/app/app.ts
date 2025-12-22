import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './utils/routes';
import cookieParser from 'cookie-parser';
import { GlobalErrorHandler } from './errors/globalErrorHandler';
import envConfig from './config/env.config';
const app = express();

//Middlewares
app.use(express.json());

app.use(
  cors({ origin: [envConfig.url.client_origin as string], credentials: true }),
);

app.use(cookieParser());

//  Routes
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: '🚀 Server is running' });
});

// API routes
app.use('/api', routes);

// Route not found Handler
app.use((req: Request, res: Response) => {
  res
    .status(404)
    .json({ success: false, statusCode: 404, message: 'Route not found' });
});

// Global Error Handler
app.use(GlobalErrorHandler);

export default app;
