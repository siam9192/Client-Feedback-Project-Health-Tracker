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
  progressPercentage: number;
  healthScore: number;

  createdAt: Date;
  updatedAt: Date;

  client: Types.ObjectId | Client;
  employees: Types.ObjectId[];
}

export enum ProjectStatus {
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  CRITICAL = 'critical',
  COMPLETED = 'completed',
}

export type CreateProjectPayload = z.infer<
  typeof projectValidations.createProjectSchema
>;

export type ProjectsFilterQuery = {
  searchTerm?: string;
  status?: ProjectStatus;
};
