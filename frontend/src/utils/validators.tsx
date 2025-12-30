import { ProjectRiskStatus } from "@/types/risk.type";
import z from "zod";

const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().min(1, "Password is required"),
});

const createProjectSchema = z
  .object({
    name: z
      .string()
      .min(2, "Project name must be at least 2 characters")
      .max(100, "Project name must be at most 100 characters"),

    description: z.string().min(5, "Description must be at least 5 characters"),

    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }),

    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),

    clientId: z.string().nonempty("Client is required"),

    employeeIds: z
      .array(z.string())
      .min(1, "At least one employee must be assigned to the project"),
  })
  .refine((data) => new Date(data.startDate).getTime() <= new Date(data.endDate).getTime(), {
    message: "Start date cannot be later than end date",
    path: ["endDate"],
  });

const createEmployeeCheckinSchema = z.object({
  progressSummary: z.string().min(5, "Summary must be at least 5 characters"),
  blockers: z.string().optional(),
  confidenceLevel: z
    .int()
    .min(1, { message: "Confidence level must be between 1 and 5" })
    .max(5, { message: "Confidence level must be between 1 and 5" }),
  completePercentage: z
    .number()
    .min(1, { message: "Completion percentage must be between 1 and 100" })
    .max(100, { message: "Completion percentage must be between 1 and 100" }),
  projectId: z.string().nonempty("Project ID is required"),
});

const createRiskSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be in  100 characters"),
  severity: z.enum(["low", "medium", "high"]),
  mitigationPlan: z.string().min(10, "Please provide a detailed mitigation plan"),
  status: z.enum(ProjectRiskStatus, "Invalid status"),
  projectId: z.string().nonempty("Invalid Project ID"),
});

export const createClientFeedbackSchema = z.object({
  satisfactionRating: z
    .number("Satisfaction rating must be a number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  communicationRating: z
    .number("Communication rating must be a number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z.string().trim().max(500, "Comment must be under 500 characters").optional(),

  issueDescription: z.string().trim().max(500, "Comment must be under 500 characters").optional(),

  projectId: z.string().nonempty("The provided Project ID is not a valid format"),
});

const validators = {
  loginSchema,
  createProjectSchema,
  createEmployeeCheckinSchema,
  createRiskSchema,
  createClientFeedbackSchema,
};

export default validators;
