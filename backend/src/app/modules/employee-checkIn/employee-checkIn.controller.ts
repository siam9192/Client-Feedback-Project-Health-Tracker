import { paginationOptionPicker } from '../../helpers/pagination.helper';
import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/http-status';
import { sendSuccessResponse } from '../../utils/response';
import employeeCheckInService from './employee-checkIn.service';

class CheckInController {
  createCheckIn = catchAsync(async (req, res) => {
    const result = await employeeCheckInService.createCheckIn(
      req.user,
      req.body,
    );
    sendSuccessResponse(res, {
      message: 'Project created successfully',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  });

  getPendingCheckIns = catchAsync(async (req, res) => {
    const result = await employeeCheckInService.getPendingCheckIns(
      req.user,
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Pending checkins retrieved successfully',
      statusCode: httpStatus.OK,
      ...result,
    });
  });

  getCheckInsByProjectId = catchAsync(async (req, res) => {
    const result = await employeeCheckInService.getCheckInsByProjectId(
      req.params.projectId,
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Project feedbacks retrieved successfully',
      statusCode: httpStatus.OK,
      ...result,
    });
  });
}

export default new CheckInController();
