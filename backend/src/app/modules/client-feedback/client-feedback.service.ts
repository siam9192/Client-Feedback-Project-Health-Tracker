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
import { ProjectModel } from '../project/project.model';
import { CreateClientFeedbackPayload } from './client-feedback.interface';
import { ClientFeedbackModel } from './client-feedback.model';
import clientFeedbackValidations from './client-feedback.validation';

class ClientFeedbackService {
  async createFeedback(
    authUser: AuthUser,
    payload: CreateClientFeedbackPayload,
  ) {
    // Validate payload
    payload = clientFeedbackValidations.createFeedbackSchema.parse(payload);

    //Fetch project
    const project = await ProjectModel.findById(payload.projectId).select(
      '_id client',
    );

    //Check project existence
    if (!project) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
    if (project.client.toString() !== authUser.profileId)
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can't submit feedback in this project ",
      );
    const { week, year } = getCurrentWeek();

    // Check this week  feedback submission status
    const thisWeekCheckIn = await ClientFeedbackModel.findOne({
      client: objectId(authUser.profileId),
      project: project._id,
      week: week,
      year,
    });

    if (thisWeekCheckIn)
      throw new AppError(
        httpStatus.FORBIDDEN,
        ' Feedback already submitted  for this week',
      );

    const { issueDescription, ...others } = payload;

    // Arrange create data
    const data = {
      ...others,
      client: objectId(authUser.profileId),
      ...(issueDescription ? { description: issueDescription } : {}),
      issueFlagged: !!issueDescription,
      week: week,
      year,
    };

    // Create feedback
    const createdFeedback = await ClientFeedbackModel.create(data);

    // Create activity
    await activityService.createDirectActivity({
      projectId: payload.projectId,
      referenceId: createdFeedback._id.toString(),
      type: ActivityType.FEEDBACK,
      content: `Client provided weekly feedback with a rating of ${payload.satisfactionRating}/5.`,
      // If the client flagged an issue, mention it in the feed
      metadata: {
        rating: createdFeedback.satisfactionRating,
        issueFlagged: createdFeedback.issueFlagged,
        comment: createdFeedback.comment,
      },
      performedBy: authUser.profileId,
      performerRole: ActivityPerformerRole.CLIENT,
    });
  }

  async getCurrentUserLatestFeedback(auth: AuthUser) {
    return await ClientFeedbackModel.findOne({
      client: objectId(auth.profileId),
    }).sort({ createdAt: -1 });
  }

  async getFeedbacksByProjectId(
    projectId: string,
    paginationOptions: PaginationOptions,
  ) {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(paginationOptions);

    // Fetch feedbacks
    const data = await ClientFeedbackModel.find({
      project: objectId(projectId),
    })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('client', '_id name profilePicture');

    // Count feedbacks
    const totalResults = await ClientFeedbackModel.countDocuments({
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

export default new ClientFeedbackService();
