import { Types } from 'mongoose';
import z from 'zod';

const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, 'Project name must be at least 2 characters')
    .max(100, 'Project name must be at most 100 characters'),

  description: z.string().min(5, 'Description must be at least 5 characters'),

  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid start date',
    })
    .transform((val) => new Date(val)),

  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid end date',
    })
    .transform((val) => new Date(val)),

  clientId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid client ID',
  }),

  employeeIds: z
    .array(
      z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid employee ID',
      }),
    )
    .min(1, 'At least one employee must be assigned to the project'),
});

const projectValidations = {
  createProjectSchema,
};

export default projectValidations;
