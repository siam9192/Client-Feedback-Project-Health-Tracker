import { paginationOptionPicker } from '../../helpers/pagination.helper';
import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/http-status';
import { sendSuccessResponse } from '../../utils/response';
import activityService from './activity.service';

class ActivityController {
  getActivitiesTimelineByProjectId = catchAsync(async (req, res) => {
    const result = await activityService.getActivityTimelinesByProjectId(
      req.params.projectId,
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Project activities timeline retrieved successfully',
      statusCode: httpStatus.OK,
      ...result,
    });
  });
}

export default new ActivityController();
