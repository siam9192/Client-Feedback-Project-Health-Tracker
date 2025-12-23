import { paginationOptionPicker } from '../../helpers/pagination.helper';
import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/http-status';
import { pick } from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import userService from './user.service';

class UserController {
  getCurrentUser = catchAsync(async (req, res) => {
    const result = await userService.getCurrentUser(req.user);
    sendSuccessResponse(res, {
      message: 'Current user retrieved successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  });

  getEmployees = catchAsync(async (req, res) => {
    const result = await userService.getEmployees(
      pick(req.params, ['searchTerm', 'notIn', 'select', 'status']),
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Visible users retrieved successfully',
      statusCode: httpStatus.OK,
      ...result,
    });
  });

  getClients = catchAsync(async (req, res) => {
    const result = await userService.getClients(
      pick(req.params, ['searchTerm', 'notIn', 'select', 'status']),
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Clients  retrieved successfully',
      statusCode: httpStatus.OK,
      ...result,
    });
  });
  
}

export default new UserController();
