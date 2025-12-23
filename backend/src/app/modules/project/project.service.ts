import AppError from '../../errors/AppError';
import httpStatus from '../../utils/http-status';
import { User, UserRole, UserStatus } from '../user/user.interface';
import { ClientModel, EmployeeModel } from '../user/user.model';
import {
  CreateProjectPayload,
  ProjectsFilterQuery,
} from './project.interface';
import projectValidations from './project.validation';

import { ProjectModel } from './project.model';
import { objectId } from '../../helpers/utils.helper';
import { PaginationOptions } from '../../types';
import { calculatePagination } from '../../helpers/pagination.helper';
import { AuthUser } from '../auth/auth.interface';

class ProjectService {
  async createProject(payload: CreateProjectPayload) {
    /* ------------------ 1. Validate payload ------------------ */
    payload = projectValidations.createProjectSchema.parse(payload);

    const { employeeIds, clientId, ...othersData } = payload;

    /* ------------------ 2. Fetch client ------------------ */
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

    /* ------------------ 3. Fetch employees ------------------ */
    const employeeObjectIds = employeeIds.map((id) => objectId(id));

    const employees = await EmployeeModel.find({
      _id: { $in: employeeObjectIds },
    }).populate({
      path: 'user',
      select: 'status',
    });

    /* ------------------ 4. Validate employees ------------------ */
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

    /* ------------------ 5. Prepare employees payload ------------------ */
    const projectEmployees = employeeObjectIds.map((id) => ({
      id,
      employee: id,
    }));

    /* ------------------ 6. Create project ------------------ */
    return await ProjectModel.create({
      clientId,
      client: clientId,
      ...othersData,
      employees: projectEmployees,
    });
  }

  async getAssignedProjects(
    authUser: AuthUser,
    filterQuery: ProjectsFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    const { page, skip, limit,sortBy,sortOrder} = calculatePagination(paginationOptions);
    const { searchTerm, ...others } = filterQuery;

    const whereConditions: any = {

    };

    if(authUser.role === UserRole.CLIENT) {
        whereConditions.clientId =  authUser.profileId
    }

    else {
      whereConditions["employees.id"] = authUser.profileId
    }


    //  Add searchTerm on existence
    if (searchTerm?.trim()) {
      whereConditions.title = { $regex: searchTerm, $options: 'i' };
    }

    // Other filters
    Object.entries(others).forEach(([key, value]) => {
      if (value !== undefined && value !== null) whereConditions[key] = value;
    });
   
    const projects =  await ProjectModel.find(whereConditions).sort({
      [sortBy]:sortOrder
    }).skip(skip).limit(limit).populate([{
      path:"client",
      select:"name profilePicture"
    },{path:"employees.employee", select:"name profilePicture"}]).lean()
    .exec();
   
    const totalResults = await ProjectModel.countDocuments(whereConditions)
    .exec();
    
    return {
      data:projects,
      meta:{
        page,
        limit,
        totalResults
      }
    }

  }
}
export default new ProjectService();
