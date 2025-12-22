import { ESortOrder } from '../helpers/pagination.helper';

export enum Environment {
  Development = 'Development',
  Production = 'Production',
}

export interface PaginationOptions {
  page?: string | number;
  limit?: number;
  sortBy?: string | undefined;
  sortOrder?: string;
}

export interface AuthUser {
  id: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  skip: number;
  sortOrder: ESortOrder;
  sortBy: string;
}

export interface FilterQuery {
  [key: string]: string | number;
}

export interface ConnectedUser {
  userId: string;
  socketIds: string[];
}

export enum TaskEvent {
  CREATED = 'task:created',
  UPDATED = 'task:updated',
  ASSIGNED = 'task:assigned',
  UNASSIGNED = 'task:unassigned',
  COMPLETED = 'task:completed',
  DELETED = 'task:deleted',
}
