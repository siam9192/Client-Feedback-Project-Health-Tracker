import { Document, Types } from 'mongoose';
import z from 'zod';
import userValidations from './user.validation';

// Model interfaces

export interface User extends Document {
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  profileId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface Admin extends Document {
  userId: Types.ObjectId;
  user?: Types.ObjectId | User;
  name: string;
  gender?: Gender;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee extends Document {
  userId: Types.ObjectId;
  user?: Types.ObjectId | User;
  name: string;
  gender: Gender;
  profilePicture: string;

  position: string;
  employmentType: EmploymentType;

  address?: Address;
  contactInfo: ContactInfo;

  count: {
    runningProjects: number;
    completedProjects: number;
    overdueProjects: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface Client extends Document {
  userId: Types.ObjectId;
  user?: Types.ObjectId | User;
  name: string;
  gender?: Gender;
  profilePicture?: string;

  clientType: ClientType;
  address: Address;

  contactInfo: ContactInfo;

  count: {
    runningProjects: number;
    completedProjects: number;
    overdueProjects: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

// Enums

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  CLIENT = 'client',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum ClientType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

export type ContactInfo = {
  email?: string;
  phone?: string;
};

export type Address = {
  street?: string;
  city: string;
  state?: string;
  country: string;
  postcode?: string;
};

export enum EmploymentType {
  FULLTIME = 'fulltime',
  PARTTIME = 'parttime',
  INTERN = 'intern',
  CONTRACT = 'contract',
}

// Service payloads
export type CreateAdminPayload = z.infer<
  typeof userValidations.createAdminSchema
>;

export type CreateEmployeePayload = z.infer<
  typeof userValidations.createEmployeeSchema
>;

export type CreateClientPayload = z.infer<
  typeof userValidations.createClientSchema
>;

// Other types
export type UsersFilterQuery = {
  searchTerm?: string;
  notIn?: string;
  select?: string;
  status?: string;
};
