import AppError from '../../errors/AppError';
import httpStatus from '../../utils/http-status';
import { User, UserRole, UserStatus } from '../user/user.interface';
import { ClientModel, EmployeeModel } from '../user/user.model';
import {
  CreateProjectPayload,
  Project,
  ProjectsFilterQuery,
} from './project.interface';
import projectValidations from './project.validation';

import { ProjectModel } from './project.model';
import { objectId } from '../../helpers/utils.helper';
import { PaginationOptions } from '../../types';
import { calculatePagination } from '../../helpers/pagination.helper';
import { AuthUser } from '../auth/auth.interface';
import { ObjectId, Types } from 'mongoose';

class ProjectService {
  async createProject(payload: CreateProjectPayload) {
    //  Validate payload
    payload = projectValidations.createProjectSchema.parse(payload);

    const { employeeIds, clientId, ...othersData } = payload;

    //  Fetch client
    const client = await ClientModel.findById(clientId).populate({
      path: 'user',
      select: 'status',
    });

    if (!client) {
      throw new AppError(httpStatus.NOT_FOUND, 'Client not found');
    }

    if ((client.user as User)?.status === UserStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Project assignment is not allowed for blocked clients',
      );
    }

    //  Fetch employees
    const employeeObjectIds = employeeIds.map((id) => objectId(id));

    const employees = await EmployeeModel.find({
      _id: { $in: employeeObjectIds },
    }).populate({
      path: 'user',
      select: 'status',
    });

    //  Validate employee
    if (employees.length !== employeeIds.length) {
      const foundIds = new Set(employees.map((e) => e._id.toString()));
      const missingId = employeeIds.find((id) => !foundIds.has(id));
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Employee not found: ${missingId}`,
      );
    }

    for (const employee of employees) {
      if ((employee.user as User)?.status === UserStatus.BLOCKED) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `Project assignment not allowed for blocked employee: ${employee._id}`,
        );
      }
    }

    // Create project
    return await ProjectModel.create({
      client: clientId,
      ...othersData,
      employees: employeeIds.map((id) => objectId(id)),
    });
  }

  async getAssignedProjects(
    authUser: AuthUser,
    filterQuery: ProjectsFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    const { page, skip, limit, sortBy, sortOrder } =
      calculatePagination(paginationOptions);
    const { searchTerm, ...others } = filterQuery;

    const whereConditions: any = {};

    if (authUser.role === UserRole.CLIENT) {
      whereConditions.clientId = authUser.profileId;
    } else {
      whereConditions['employees'] = authUser.profileId;
    }

    //  Add searchTerm on existence
    if (searchTerm?.trim()) {
      whereConditions.title = { $regex: searchTerm, $options: 'i' };
    }

    // Other filters
    Object.entries(others).forEach(([key, value]) => {
      if (value !== undefined && value !== null) whereConditions[key] = value;
    });

    const projects = await ProjectModel.find(whereConditions)
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'client',
          select: 'name profilePicture',
        },
        { path: 'employees.employee', select: 'name profilePicture' },
      ])
      .lean()
      .exec();

    const totalResults =
      await ProjectModel.countDocuments(whereConditions).exec();

    return {
      data: projects,
      meta: {
        page,
        limit,
        totalResults,
      },
    };
  }
  async getAllGroupProjectsByHealthStatus() {

    //  Aggregate projects grouped by status
    const groups = await ProjectModel.aggregate([
      {
        $group: {
          _id: '$status',
          projects: { $push: '$$ROOT' },
        },
      },
    ]).exec();

    //  Collect unique client and employee IDs
    const clientIds = new Set<string>();
    const employeeIds = new Set<string>();

    groups.forEach((group) => {
      group.projects.forEach((project: Project) => {
        if (project.client) clientIds.add(project.client.toString());
        project.employees?.forEach((empId) =>
          employeeIds.add(empId.toString()),
        );
      });
    });

    // Fetch clients and employees
    const clients = await ClientModel.find({
      _id: { $in: [...clientIds].map((id) => new Types.ObjectId(id)) },
    })
      .select('_id name profilePicture')
      .lean()
      .exec();

    const employees = await EmployeeModel.find({
      _id: { $in: [...employeeIds].map((id) => new Types.ObjectId(id)) },
    })
      .select('_id name profilePicture')
      .lean()
      .exec();

    //  Convert arrays 
    const clientMap = new Map(clients.map((c) => [c._id.toString(), c]));
    const employeeMap = new Map(employees.map((e) => [e._id.toString(), e]));

    // Populate client & employees efficiently
    const result = groups.map((group) => {
      const projects = group.projects.map((project: Project) => ({
        ...project,
        client: clientMap.get(project.client?.toString() || '') || null,
        employees: project.employees
          ?.map((empId) => employeeMap.get(empId.toString()))
          .filter(Boolean),
      }));

      return {
        status: group._id,
        projects,
      };
    });

    return result;
  }

  async getHighRiskProjects() {

  }
}
export default new ProjectService();
