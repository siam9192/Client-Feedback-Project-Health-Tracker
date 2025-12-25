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

    //Fetch project
    const project = await ProjectModel.findById(payload.projectId).select(
      '_id employees',
    );

    //Check project existence
    if (!project) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
    if (!project.employees.includes(objectId(authUser.profileId)))
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can't submit check in in this project ",
      );
    const { week, year } = getCurrentWeek();

    // Check this week  check in submission status
    const thisWeekCheckIn = await EmployeeCheckInModel.findOne({
      employee: objectId(authUser.profileId),
      project: project._id,
      week: week,
      year,
    });

    if (thisWeekCheckIn)
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Checked in  submitted already for this week',
      );

    const createdCheckIn = await EmployeeCheckInModel.create({
      ...payload,
      employee: objectId(authUser.profileId),
    });

    // Create activity
    await activityService.createDirectActivity({
      projectId: payload.projectId,
      referenceId: createdCheckIn._id.toString(),
      type: ActivityType.CHECKIN,
      content: `Submitted weekly check-in with ${createdCheckIn.confidenceLevel}/5 confidence.`,
      metadata: {
        confidence: createdCheckIn.confidenceLevel,
      },
      performedBy: authUser.profileId,
      performerRole: ActivityPerformerRole.EMPLOYEE,
    });

    return createdCheckIn;
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
                startAt: 1,
                endAt: 1,
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
