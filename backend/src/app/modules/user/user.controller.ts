import { paginationOptionPicker } from '../../helpers/pagination.helper';
import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/http-status';
import { pick } from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import userService from './user.service';

class UserController {
  getCurrentUser = catchAsync(async (req, res) => {
    const result = await userService.getCurrentUserFromDB(req.user);
    sendSuccessResponse(res, {
      message: 'Current user retrieved successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  });

  updateUserProfile = catchAsync(async (req, res) => {
    const result = await userService.updateUserProfile(req.user, req.body);
    sendSuccessResponse(res, {
      message: 'User profile updated successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  });
  getVisibleUsers = catchAsync(async (req, res) => {
    const result = await userService.getVisibleUsersFromDB(
      req.user,
      pick(req.params, ['searchTerm']),
      paginationOptionPicker(req.params),
    );
    sendSuccessResponse(res, {
      message: 'Visible users retrieved successfully',
      statusCode: httpStatus.OK,
      ...result,
    });
  });
}

export default new UserController();
