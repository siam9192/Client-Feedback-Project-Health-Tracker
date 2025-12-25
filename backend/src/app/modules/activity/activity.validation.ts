import { Types } from 'mongoose';
import { ActivityType, ActivityPerformerRole } from './activity.interface';
import z from 'zod';

export const createActivitySchema = z.object({
  type: z.nativeEnum(ActivityType, 'Invalid activity type'),

  content: z
    .string()
    .min(1, 'Content cannot be empty')
    .max(500, 'Content is too long'),

  metadata: z.record(z.string(), z.any()).optional(),

  referenceId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid Reference ID',
    })
    .optional(),

  projectId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid Project ID',
  }),

  performerRole: z.nativeEnum(ActivityPerformerRole, 'Invalid user role'),

  performedBy: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid Performer ID',
    })
    .optional(),
});

const activityValidations = {
  createActivitySchema,
};

export default activityValidations;
