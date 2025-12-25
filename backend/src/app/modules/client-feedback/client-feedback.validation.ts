import z from 'zod';
import { Types } from 'mongoose';

export const createFeedbackSchema = z.object({
  satisfactionRating: z
    .number('Satisfaction rating must be a number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),

  communicationRating: z
    .number('Communication rating must be a number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),

  comment: z
    .string()
    .trim()
    .min(1, 'Provide a description of the issue')
    .max(500, 'Comment must be under 500 characters')
    .optional(),

  issueDescription: z
    .string()
    .trim()
    .nonempty('Issue length at least 1 character')
    .optional(),

  projectId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'The provided Project ID is not a valid format',
  }),
});

const clientFeedbackValidations = {
  createFeedbackSchema,
};

export default clientFeedbackValidations;
