import z from 'zod';
import { Types } from 'mongoose';

const createCheckInSchema = z.object({
  progressSummary: z.string(),

  message: z.string().optional(),

  blockers: z.string().optional(),

  confidenceLevel: z.number().min(1).max(5),

  completePercentage: z.number().min(0).max(100),

  project: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid project ID',
  }),
});

const employeeCheckInValidations = {
  createCheckInSchema,
};

export default employeeCheckInValidations;
