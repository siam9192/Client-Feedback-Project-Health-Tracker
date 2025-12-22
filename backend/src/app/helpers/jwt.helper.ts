import jwt from 'jsonwebtoken';
import { de } from 'zod/v4/locales';

const generateToken = (payload: any, secret: string, expiresIn: string) => {
  const token = jwt.sign(payload, secret, { expiresIn: expiresIn as any });

  return token;
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as any;
};

const jwtHelper = { generateToken, verifyToken };

export default jwtHelper;
