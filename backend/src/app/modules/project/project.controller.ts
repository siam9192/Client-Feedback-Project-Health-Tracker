import { paginationOptionPicker } from '../../helpers/pagination.helper';
import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/http-status';
import { pick } from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import projectService from './project.service';

class ProjectController {
  createProject = catchAsync(async (req, res) => {
    const result = await projectService.createProject(req.body);
    sendSuccessResponse(res, {
      message: 'Project created successfully',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  });

  getAssignedProjects = catchAsync(async (req, res) => {
    const result = await projectService.getAssignedProjects(
      req.user,
      pick(req.query, ['searchTerm', 'status']),
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Assigned projects retrieved successfully',
      statusCode: httpStatus.OK,
      ...result,
    });
  });

  getAllGroupProjectsByHealthStatus = catchAsync(async (req, res) => {
    const result = await projectService.getAllGroupProjectsByHealthStatus();
    sendSuccessResponse(res, {
      message: 'Assigned projects retrieved successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  });

  getProjectById = catchAsync(async (req, res) => {
    const result = await projectService.getProjectById(
      req.user,
      req.params.projectId,
    );
    sendSuccessResponse(res, {
      message: 'Assigned projects retrieved successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  });
}

export default new ProjectController();
