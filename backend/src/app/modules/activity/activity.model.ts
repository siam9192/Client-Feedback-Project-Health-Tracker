import { model, Schema } from 'mongoose';
import {
  Activity,
  ActivityType,
  ActivityPerformerRole,
} from './activity.interface';

const ActivityModelSchema = new Schema<Activity>(
  {
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    metadata: Schema.Types.Mixed,

    referenceId: {
      type: Schema.Types.ObjectId,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    performerRole: {
      type: String,
      enum: Object.values(ActivityPerformerRole),
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);
export const ActivityModel = model<Activity>('Activity', ActivityModelSchema);
