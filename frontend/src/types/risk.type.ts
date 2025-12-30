import z from "zod";
import { Project, ProjectEmployee } from "./project.type";
import validators from "@/utils/validators";

export interface ProjectRisk {
  _id: string;
  title: string;
  severity: ProjectRiskSeverity;
  mitigationPlan: string;
  status: ProjectRiskStatus;
  resolvedAt: string;

  project: Pick<Project, "_id" | "name" | "healthScore" | "status">;
  employee: ProjectEmployee;

  createdAt: string;
  updatedAt: string;
}

export type CreateRiskPayload = z.infer<typeof validators.createRiskSchema>;

export enum IssueStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
}

export enum ProjectRiskSeverity {
  HIGH = "high",
  LOW = "low",
  MEDIUM = "medium",
}

export enum ProjectRiskStatus {
  OPEN = "open",
  RESOLVED = "resolved",
}
