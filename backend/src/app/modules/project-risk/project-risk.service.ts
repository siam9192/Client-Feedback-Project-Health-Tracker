import AppError from '../../errors/AppError';
import { calculatePagination } from '../../helpers/pagination.helper';
import { objectId } from '../../helpers/utils.helper';
import { PaginationOptions } from '../../types';
import httpStatus from '../../utils/http-status';
import {
  ActivityPerformerRole,
  ActivityType,
} from '../activity/activity.interface';
import activityService from '../activity/activity.service';
import { AuthUser } from '../auth/auth.interface';
import { ProjectModel } from '../project/project.model';
import {
  CreateProjectRiskPayload,
  ProjectRisksFilterQuery,
} from './project-risk.interface';
import { ProjectRiskModel } from './project-risk.model';
import projectRiskValidations from './project-risk.validation';

class ProjectRiskService {
  async createRisk(authUser: AuthUser, payload: CreateProjectRiskPayload) {
    // Validate payload
    payload = projectRiskValidations.createRiskSchema.parse(payload);

    //Fetch project
    const project = await ProjectModel.findById(payload.projectId);

    // Check project existence
    if (!project) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');

    // Authorize
     if (!project.employees.includes(objectId(authUser.profileId)))
          throw new AppError(
            httpStatus.FORBIDDEN,
            "You can't submit chickin in this project ",
        );

    const { projectId, ...others } = payload;

    // Arrange create data
    const data = {
      ...others,
      project: objectId(projectId),
      employee: objectId(authUser.profileId),
    };

    // Create risk
    const createdRisk = await ProjectRiskModel.create(data);

    await activityService.createDirectActivity({
      projectId: payload.projectId,
      referenceId: createdRisk._id.toString(),
      type: ActivityType.RISK,
      content: `New ${createdRisk.severity} severity risk: "${createdRisk.title}"`,
      metadata: {
        severity: createdRisk.severity,
        status: createdRisk.status,
      },
      performedBy: authUser.profileId,
      performerRole: ActivityPerformerRole.CLIENT,
    });
    return createdRisk
  }

  async getRisks(
    filterQuery: ProjectRisksFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(paginationOptions);

    const whereConditions = {
      ...filterQuery,
    };

    // Fetch risks
    const data = await ProjectRiskModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'employee',
          select: '_id name profilePicture',
        },
        {
          path: 'project',
          select: '_id name status healthScore',
        },
      ]);

    // Count  risks
    const totalResults = await ProjectRiskModel.countDocuments(whereConditions);

    // Return result
    return {
      data,
      meta: {
        page,
        limit,
        totalResults,
      },
    };
  }
}

export default new ProjectRiskService();
