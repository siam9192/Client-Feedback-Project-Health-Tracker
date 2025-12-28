import { Types } from 'mongoose';
import z from 'zod';

import projectRiskValidations from './project-risk.validation';

export interface ProjectRisk extends Document {
  title: string;
  severity: ProjectRiskSeverity;
  mitigationPlan: string;
  status: ProjectRiskStatus;
  resolvedAt: Date;

  project: Types.ObjectId;
  employee: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export type CreateProjectRiskPayload = z.infer<
  typeof projectRiskValidations.createRiskSchema
>;

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
}

export enum ProjectRiskSeverity {
  HIGH = 'high',
  LOW = 'low',
  MEDIUM = 'medium',
}

export enum ProjectRiskStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
}

export type ProjectRisksFilterQuery = {
  severity?: ProjectRiskSeverity;
  status?: ProjectRiskStatus;
};
