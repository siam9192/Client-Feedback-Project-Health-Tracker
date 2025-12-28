import {
  ActivityPerformerRole,
  CreateActivityPayload,
} from './activity.interface';
import projectValidations from './activity.validation';
import { ActivityModel } from './activity.model';
import { objectId } from '../../helpers/utils.helper';
import { PaginationOptions } from '../../types';
import { calculatePagination } from '../../helpers/pagination.helper';
import projectService from '../project/project.service';

class ActivityService {
  async createDirectActivity(
    payload: CreateActivityPayload,
    updateProjectHealthScore = true,
  ) {
    //  Validate payload
    payload = projectValidations.createActivitySchema.parse(payload);

    const { performedBy, projectId, referenceId, ...others } = payload;

    // Create activity
    const createdActivity = await ActivityModel.create({
      ...others,
      ...(referenceId ? { referenceId: objectId(referenceId) } : {}),
      ...(performedBy ? { performedBy: objectId(performedBy) } : {}),
      project: objectId(projectId),
    });

    if (updateProjectHealthScore)
      await projectService.updateProjectHealthScore(payload.projectId);

    return createdActivity;
  }

  async getActivityTimelinesByProjectId(
    projectId: string,
    paginationOptions: PaginationOptions,
  ) {
    const { page, skip, limit } = calculatePagination(paginationOptions);

    const result = await ActivityModel.aggregate([
      {
        $match: { project: objectId(projectId) },
      },
      //  Lookups
      {
        $lookup: {
          from: 'employees',
          localField: 'performedBy',
          foreignField: '_id',
          as: 'emp',
        },
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'performedBy',
          foreignField: '_id',
          as: 'cli',
        },
      },
      {
        $lookup: {
          from: 'admins',
          localField: 'performedBy',
          foreignField: '_id',
          as: 'adm',
        },
      },

      // Add field
      {
        $addFields: {
          performedBy: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ['$performerRole', ActivityPerformerRole.ADMIN],
                  },
                  then: { $arrayElemAt: ['$adm', 0] },
                },
                {
                  case: {
                    $eq: ['$performerRole', ActivityPerformerRole.EMPLOYEE],
                  },
                  then: { $arrayElemAt: ['$emp', 0] },
                },
                {
                  case: {
                    $eq: ['$performerRole', ActivityPerformerRole.CLIENT],
                  },
                  then: { $arrayElemAt: ['$cli', 0] },
                },
              ],
              default: null,
            },
          },

          dateKey: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },

      {
        $project: {
          _id: 1,
          type: 1,
          content: 1,
          metadata: 1,
          dateKey: 1,
          createdAt: 1,
          performedBy: {
            _id: 1,
            name: 1,
            profilePicture: 1,
          },
        },
      },
      { $sort: { createdAt: 1 } },
      // Group by Date
      {
        $group: {
          _id: '$dateKey',
          activities: { $push: '$$ROOT' },
        },
      },

      // Final Pagination and Sorting
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: { _id: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                date: '$_id',
                _id: 0,
                activities: 1,
              },
            },
          ],
        },
      },
    ]);
    const data = result[0]?.data || [];
    const totalResults = result[0]?.metadata?.count || 0;
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
export default new ActivityService();
