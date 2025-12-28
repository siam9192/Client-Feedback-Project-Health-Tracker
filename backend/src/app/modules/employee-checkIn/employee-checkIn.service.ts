import { startSession } from 'mongoose';
import AppError from '../../errors/AppError';
import { calculatePagination } from '../../helpers/pagination.helper';
import { getCurrentWeek, objectId } from '../../helpers/utils.helper';
import { PaginationOptions } from '../../types';
import httpStatus from '../../utils/http-status';
import {
  ActivityPerformerRole,
  ActivityType,
} from '../activity/activity.interface';
import activityService from '../activity/activity.service';
import { AuthUser } from '../auth/auth.interface';
import { ProjectStatus } from '../project/project.interface';
import { ProjectModel } from '../project/project.model';
import { CreateEmployeeCheckInPayload } from './employee-checkIn.interface';
import { EmployeeCheckInModel } from './employee-checkIn.model';
import employeeCheckInValidations from './employee-checkIn.validation';

class EmployeeCheckInService {
 async createCheckIn(
  authUser: AuthUser,
  payload: CreateEmployeeCheckInPayload,
) {
  // Validate payload
  payload = employeeCheckInValidations.createCheckInSchema.parse(payload);

  const project = await ProjectModel.findById(payload.projectId).select(
    '_id employees progressPercentage'
  );

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const employeeId = objectId(authUser.profileId);

  if (!project.employees.includes(employeeId)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can't submit a check-in for this project"
    );
  }

  const { week, year } = getCurrentWeek();

  // Check if this week's check-in already exists
  const existingCheckIn = await EmployeeCheckInModel.findOne({
    employee: employeeId,
    project: project._id,
    week,
    year,
  });

  if (existingCheckIn) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You have already completed your weekly check-in'
    );
  }

  const totalProgress = project.progressPercentage + payload.completePercentage;
  if (totalProgress > 100) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Total progress cannot exceed 100%');
  }

  const session = await startSession();
  session.startTransaction();

  try {
    // Create the check-in
    const [createdCheckIn] = await EmployeeCheckInModel.create(
      [
        {
          ...payload,
          week,
          year,
          employee: employeeId,
          project: project._id,
        },
      ],
      { session }
    );

    // Update project progress
    project.progressPercentage = totalProgress;
    await project.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Record activity 
    await activityService.createDirectActivity({
      projectId: payload.projectId,
      referenceId: createdCheckIn._id.toString(),
      type: ActivityType.CHECKIN,
      content: `Submitted weekly check-in with ${createdCheckIn.confidenceLevel}/5 confidence.`,
      metadata: { confidence: createdCheckIn.confidenceLevel },
      performedBy: authUser.profileId,
      performerRole: ActivityPerformerRole.EMPLOYEE,
    });

    return createdCheckIn;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to create check-in'
    );
  } finally {
    await session.endSession();
  }
}

  async getPendingCheckIns(
    authUser: AuthUser,
    paginationOptions: PaginationOptions,
  ) {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(paginationOptions);
    const { week, year } = getCurrentWeek();
    const employeeId = objectId(authUser.profileId);

    const result = await ProjectModel.aggregate([
      //  Match active projects assigned to employee
      {
        $match: {
          employees: employeeId,
          status: { $ne: ProjectStatus.COMPLETED },
        },
      },

      // Lookup check-ins for this employee & week
      {
        $lookup: {
          from: 'employeecheckins',
          let: { projectId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$project', '$$projectId'] },
                    { $eq: ['$employee', employeeId] },
                    { $eq: ['$week', week] },
                    { $eq: ['$year', year] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: 'checkIns',
        },
      },

      //  Keep only projects with NO check-ins
      {
        $match: {
          checkIns: { $eq: [] },
        },
      },

      //   Sort
      {
        $sort: {
          [sortBy]: sortOrder,
        },
      },

      {
        $facet: {
          data: [
            //  Pagination by skip and limiting
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },

            //   Select field
            {
              $project: {
                _id: 1,
                name: 1,
                status: 1,
                healthScore: 1,
                progressPercentage: 1,
                startDate: 1,
                endDate: 1,
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const data = result[0].data || [];
    const totalResults = result[0]?.totalCount[0]?.count || 0;

    return {
      data,
      meta: {
        page,
        limit,
        totalResults,
      },
    };
  }

  async getCheckInsByProjectId(
    projectId: string,
    paginationOptions: PaginationOptions,
  ) {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(paginationOptions);

    // Fetch feedbacks
    const data = await EmployeeCheckInModel.find({
      project: objectId(projectId),
    })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('employee', '_id name profilePicture');

    // Count feedbacks
    const totalResults = await EmployeeCheckInModel.countDocuments({
      project: objectId(projectId),
    });

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

export default new EmployeeCheckInService();
