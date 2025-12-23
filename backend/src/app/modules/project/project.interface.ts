import { Document, Types } from 'mongoose';
import { Client, Employee } from '../user/user.interface';
import z from 'zod';
import projectValidations from './project.validation';

export interface Project extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  healthScore: number;

  createdAt: Date;
  updatedAt: Date;

  clientId: Types.ObjectId;
  client?: Types.ObjectId | Client;
  employees: {
    id: Types.ObjectId;
    employee: Types.ObjectId | Employee;
  }[];
}

export enum ProjectStatus {
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  CRITICAL = 'critical',
  Completed = 'completed',
}

export type CreateProjectPayload = z.infer<
  typeof projectValidations.createProjectSchema
>;

export type ProjectsFilterQuery = {
  searchTerm?: string;
  status?: ProjectStatus;
};
