import z from 'zod';
import { ClientType, EmploymentType, Gender } from './user.interface';

const email = z
  .string()
  .min(5, 'Email must be at least 5 characters')
  .max(50, 'Email must be at most 50 characters')
  .email('Invalid email address');
const password = z.string().min(6, 'Password must be at least 6 characters');

export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().nonempty('City is required'),
  state: z.string().optional(),
  country: z.string().nonempty('Country is required'),
  postcode: z.string().optional(),
});

export const contactInfoSchema = z.object({
  email: email.optional(),
  phone: z
    .string()
    .min(8, 'Phone number must be at least 8 characters')
    .max(15, 'Phone number must be at most 15 characters')
    .optional(),
});

const createAdminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(30),
  profilePicture: z.string().url().optional(),
  gender: z.nativeEnum(Gender).optional(),
  email: email,
  password: password,
});

export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(30),
  gender: z.nativeEnum(Gender),
  profilePicture: z.string().url(),
  position: z.string().min(2, 'Position must be at least 2 characters').max(30),
  employmentType: z.nativeEnum(EmploymentType),
  address: addressSchema.optional(),
  contactInfo: contactInfoSchema.optional(),

  email: email,
  password: password,
});

export const createClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(30),
  gender: z.nativeEnum(Gender).optional(),
  profilePicture: z.string().url().optional(),

  clientType: z.nativeEnum(ClientType),
  address: addressSchema.optional(),
  contactInfo: contactInfoSchema.optional(),

  email: email,
  password: password,
});

const userValidations = {
  createAdminSchema,
  createEmployeeSchema,
  createClientSchema,
};

export default userValidations;
