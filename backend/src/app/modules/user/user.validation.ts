import { Gender } from '@prisma/client';
import z from 'zod';

const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),

  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),

  email: z.string().email('Invalid email address'),

  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .optional(),

  profilePhoto: z
    .string()
    .url('Profile picture must be a valid URL')
    .nullable()
    .optional(),

  gender: z.nativeEnum(Gender).nullable().optional(),
});

const userValidations = { createUserSchema, updateUserProfileSchema };

export default userValidations;
