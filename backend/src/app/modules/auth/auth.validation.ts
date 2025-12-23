import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Identifier is required'),
  password: z.string().min(1, 'Password is required'),
});

const authValidations = {
  loginSchema,
};

export default authValidations;
