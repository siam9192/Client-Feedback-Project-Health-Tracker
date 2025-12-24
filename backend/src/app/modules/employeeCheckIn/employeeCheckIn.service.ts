import AppError from '../../errors/AppError';
import { calculatePagination } from '../../helpers/pagination.helper';
import { getCurrentWeek, objectId } from '../../helpers/utils.helper';
import { PaginationOptions } from '../../types';
import httpStatus from '../../utils/http-status';
import { AuthUser } from '../auth/auth.interface';
import { ProjectStatus } from '../project/project.interface';
import { ProjectModel } from '../project/project.model';
import { CreateEmployeeCheckInPayload } from './employeeCheckIn.interface';
import { EmployeeCheckInModel } from './employeeCheckIn.model';

class EmployeeCheckInService {
  async createCheckIn(
    authUser: AuthUser,
    payload: CreateEmployeeCheckInPayload,
  ) {
    //Fetch project
    const project = await ProjectModel.findById(payload.project).select(
      '_id employees',
    );

    //Check project existence
    if (!project) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
    if (!project.employees.includes(objectId(authUser.profileId)))
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can't submit check in in this project ",
      );
    const { weekNumber, year } = getCurrentWeek();

    // Check this week  check in submission status
    const thisWeekCheckIn = await EmployeeCheckInModel.findOne({
      employee: objectId(authUser.profileId),
      project: project._id,
      week: weekNumber,
      year,
    });

    if (thisWeekCheckIn)
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Checked in  submitted already for this week',
      );

    return await EmployeeCheckInModel.create({
      ...payload,
      employee: objectId(authUser.profileId),
    });
  }

  async getPendingCheckIns(
    authUser: AuthUser,
    paginationOptions: PaginationOptions,
  ) {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(paginationOptions);
    const { weekNumber, year } = getCurrentWeek();
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
                    { $eq: ['$week', weekNumber] },
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
}

export default new EmployeeCheckInService();
