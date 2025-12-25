import { paginationOptionPicker } from '../../helpers/pagination.helper';
import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/http-status';
import { pick } from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import projectRiskService from './project-risk.service';

class ProjectRiskController {
  createRisk = catchAsync(async (req, res) => {
    const result = await projectRiskService.createRisk(req.user, req.body);
    sendSuccessResponse(res, {
      message: 'Project risk created successfully',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  });

  getRisks = catchAsync(async (req, res) => {
    const result = await projectRiskService.getRisks(
      pick(req.query, ['status', 'severity']),
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Project risks retrieved successfully',
      statusCode: httpStatus.OK,
      ...result,
    });
  });
}

export default new ProjectRiskController();
