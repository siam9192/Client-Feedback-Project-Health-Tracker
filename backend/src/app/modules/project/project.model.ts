import { model, Schema } from 'mongoose';
import { Project, ProjectStatus } from './project.interface';

const ProjectModelSchema = new Schema<Project>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: { type: String, required: true, trim: true, minlength: 5 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.ON_TRACK,
    },
    healthScore: { type: Number, min: 0, max: 100, default: 100 },

    client: { type: Schema.Types.ObjectId, ref: 'Client' },

    employees: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
      ref: 'Employee',
      required: true,
      validate: [
        (val: any[]) => val.length > 0,
        'At least one employee is required',
      ],
    },
  },
  { timestamps: true },
);

export const ProjectModel = model<Project>('Project', ProjectModelSchema);
