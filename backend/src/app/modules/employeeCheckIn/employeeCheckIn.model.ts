import { Schema, model, Types } from 'mongoose';
import { EmployeeCheckIn } from './employeeCheckIn.interface';

const EmployeeCheckInSchema = new Schema<EmployeeCheckIn>(
  {
    progressSummary: {
      type: String,
      required: true,
      trim: true,
    },
    blockers: {
      type: String,
      trim: true,
    },
    confidenceLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    completePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    week: {
      type: Number,
      required: true,
      min: 1,
      max: 55,
    },
    year: {
      type: Number,
      required: true,
    },
    project: {
      type: Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    employee: {
      type: Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const EmployeeCheckInModel = model(
  'EmployeeCheckIn',
  EmployeeCheckInSchema,
);
