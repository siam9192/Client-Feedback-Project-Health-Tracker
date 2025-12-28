import AppError from '../../errors/AppError';
import httpStatus from '../../utils/http-status';
import { PaginationOptions } from '../../types';
import { calculatePagination } from '../../helpers/pagination.helper';
import { AuthUser } from '../auth/auth.interface';
import {
  CreateAdminPayload,
  CreateClientPayload,
  CreateEmployeePayload,
  UserRole,
  UsersFilterQuery,
} from './user.interface';
import {
  AdminModel,
  ClientModel,
  EmployeeModel,
  UserModel,
} from './user.model';
import mongoose, { Types } from 'mongoose';
import bcryptHelper from '../../helpers/bycrypt.helper';
import userValidations from './user.validation';

class UserService {
  async getCurrentUser(authUser: AuthUser) {
    const { userId, profileId, role } = authUser;
    const user = await UserModel.findById(userId).lean();
    // Check user existence
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    let profile;

    switch (role) {
      case UserRole.CLIENT: {
        const client = await ClientModel.findById(profileId).lean();
        if (!client || !client.user)
          throw new Error('Client profile not found');

        const { user, _id, ...others } = client;

        profile = {
          _id,
          ...others,
        };
        break;
      }

      case UserRole.EMPLOYEE: {
        const employee = await EmployeeModel.findById(profileId)
          .populate('user')
          .lean();

        if (!employee || !employee.user)
          throw new Error('Employee profile not found');

        const { user, _id, ...others } = employee;

        profile = {
          _id,
          ...others,
        };
        break;
      }

      case UserRole.ADMIN: {
        const admin = await AdminModel.findById(profileId).lean();
        if (!admin || !admin.user) throw new Error('Admin profile not found');

        const { user, _id, ...others } = admin;

        profile = {
          _id,
          ...others,
        };
        break;
      }

      default:
        throw new Error('Invalid user role');
    }

    return {
      ...user,
      profile,
    };
  }

  async getUserById(id: string) {
    const user = await UserModel.findById(id).lean();
    // Check user existence
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    const { profileId, role } = user;

    let profile;

    switch (role) {
      case UserRole.CLIENT: {
        const client = await ClientModel.findById(profileId).lean();
        if (!client || !client.user)
          throw new Error('Client profile not found');

        const { user, _id, name, ...others } = client;

        profile = {
          _id,
          ...others,
        };
        break;
      }

      case UserRole.EMPLOYEE: {
        const employee = await EmployeeModel.findById(profileId)
          .populate('user')
          .lean();
        if (!employee || !employee.user)
          throw new Error('Employee profile not found');

        const { user, _id, name, ...others } = employee;

        profile = {
          _id,
          ...others,
        };
        break;
      }

      case UserRole.ADMIN: {
        const admin = await AdminModel.findById(profileId).lean();
        if (!admin || !admin.user) throw new Error('Admin profile not found');

        const { user, _id, name, ...others } = admin;

        profile = {
          _id,
          ...others,
        };
        break;
      }

      default:
        throw new Error('Invalid user role');
    }

    return {
      ...user,
      profile,
    };
  }

  async getClients(
    filterQuery: UsersFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    console.log(filterQuery);
    const { searchTerm, notIn, select, ...others } = filterQuery;
    const { page, skip, limit, sortBy, sortOrder } =
      calculatePagination(paginationOptions);

    //  aggregation pipelines
    const pipelines: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
        },
      },
      { $unwind: '$user' },
    ];

    // Search term
    if (searchTerm) {
      pipelines.push({
        $match: {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { 'user.email': { $regex: searchTerm, $options: 'i' } },
          ],
        },
      });
    }

    // notIn IDs
    if (notIn) {
      const notInIds = notIn.split(',').map((id) => id.trim());
      const invalidId = notInIds.find((id) => !Types.ObjectId.isValid(id));
      if (invalidId) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `Invalid ID in notIn filter: ${invalidId}`,
        );
      }

      pipelines.push({
        $match: {
          _id: { $nin: notInIds.map((id) => new Types.ObjectId(id)) },
        },
      });
    }

    // Other filters
    const refined: Record<string, any> = {};
    Object.entries(others).forEach(([key, value]) => {
      if (value !== undefined && value !== null) refined[key] = value;
    });
    if (Object.keys(refined).length) {
      pipelines.push({ $match: refined });
    }

    const selectFields = select
      ? select.split(',').reduce((acc: any, field) => {
          acc[field.trim()] = 1;
          return acc;
        }, {})
      : {};

    pipelines.push({
      $facet: {
        data: [
          { $sort: { [sortBy]: sortOrder } },
          { $skip: skip },
          { $limit: limit },
          ...(Object.keys(selectFields).length
            ? [{ $project: selectFields }]
            : []),
        ],
        totalCount: [{ $count: 'count' }],
      },
    });

    const result = await ClientModel.aggregate(pipelines);

    const clients = result[0]?.data || [];
    const totalResults = result[0]?.totalCount[0]?.count || 0;

    return {
      data: clients,
      meta: {
        page,
        limit,
        totalResults,
      },
    };
  }

  async getEmployees(
    filterQuery: UsersFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    const { searchTerm, notIn, select, ...others } = filterQuery;
    const { page, skip, limit, sortBy, sortOrder } =
      calculatePagination(paginationOptions);

    // Build aggregation pipelines
    const pipelines: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
        },
      },
      { $unwind: '$user' },
    ];

    // Search term
    if (searchTerm) {
      pipelines.push({
        $match: {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { 'user.email': { $regex: searchTerm, $options: 'i' } },
          ],
        },
      });
    }

    // notIn IDs
    if (notIn) {
      const notInIds = notIn.split(',').map((id) => id.trim());
      const invalidId = notInIds.find((id) => !Types.ObjectId.isValid(id));
      if (invalidId) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `Invalid ID in notIn filter: ${invalidId}`,
        );
      }

      pipelines.push({
        $match: {
          _id: { $nin: notInIds.map((id) => new Types.ObjectId(id)) },
        },
      });
    }

    // Other filters
    const refined: Record<string, any> = {};
    Object.entries(others).forEach(([key, value]) => {
      if (value !== undefined && value !== null) refined[key] = value;
    });
    if (Object.keys(refined).length) {
      pipelines.push({ $match: refined });
    }

    const selectFields = select
      ? select.split(',').reduce((acc: any, field) => {
          acc[field.trim()] = 1;
          return acc;
        }, {})
      : {};

    pipelines.push({
      $facet: {
        data: [
          { $sort: { [sortBy]: sortOrder } },
          { $skip: skip },
          { $limit: limit },
          ...(Object.keys(selectFields).length
            ? [{ $project: selectFields }]
            : []),
        ],
        totalCount: [{ $count: 'count' }],
      },
    });

    const result = await EmployeeModel.aggregate(pipelines);

    const employees = result[0]?.data || [];
    const totalResults = result[0]?.totalCount[0]?.count || 0;

    return {
      data: employees,
      meta: {
        page,
        limit,
        totalResults,
      },
    };
  }

  async createAdmin(payload: CreateAdminPayload) {
    // Validate payload using zod schema
    userValidations.createAdminSchema.parse(payload);

    const { email, ...profileData } = payload;
    //  Check if email already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new AppError(httpStatus.FORBIDDEN, 'This email is already in use');
    }

    //  Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create User
      const hashedPassword = await bcryptHelper.hash(payload.password, 10);
      const user = await UserModel.create(
        [
          {
            email: payload.email,
            password: hashedPassword,
            role: UserRole.ADMIN,
          },
        ],
        { session },
      );

      if (!user[0]) throw new Error();

      const admin = await AdminModel.create(
        [
          {
            user: user[0]._id,
            ...profileData,
          },
        ],
        {
          session,
        },
      );

      if (!admin[0]) throw new Error();

      // Set profile id in user
      const userUpdateStatus = await UserModel.updateOne(
        {
          _id: user[0]._id,
        },
        {
          profileId: admin[0]._id,
        },
        { session },
      );

      if (!userUpdateStatus.modifiedCount) throw new Error();

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      //  Return the created admin with populate user
      return AdminModel.findById(admin[0]._id).populate('user');
    } catch (error) {
      // Rollback on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async createEmployee(payload: CreateEmployeePayload) {
    // Validate payload using zod schema
    userValidations.createEmployeeSchema.parse(payload);

    const { email, ...profileData } = payload;
    //  Check if email already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new AppError(httpStatus.FORBIDDEN, 'This email is already in use');
    }

    //  Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create User
      const hashedPassword = await bcryptHelper.hash(payload.password, 10);
      const user = await UserModel.create(
        [
          {
            email: payload.email,
            password: hashedPassword,
            role: UserRole.EMPLOYEE,
          },
        ],
        { session },
      );

      if (!user[0]) throw new Error();

      const employee = await EmployeeModel.create(
        [
          {
            user: user[0]._id,
            ...profileData,
          },
        ],
        {
          session,
        },
      );

      if (!employee[0]) throw new Error();

      // Set profile id in user
      const userUpdateStatus = await UserModel.updateOne(
        {
          _id: user[0]._id,
        },
        {
          profileId: employee[0]._id,
        },
        { session },
      );

      if (!userUpdateStatus.modifiedCount) throw new Error();

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      //  Return the created admin with populate user
      return EmployeeModel.findById(employee[0]._id).populate('user');
    } catch (error) {
      // Rollback on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async createClient(payload: CreateClientPayload) {
    // Validate payload using zod schema
    userValidations.createClientSchema.parse(payload);

    const { email, ...profileData } = payload;
    //  Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError(httpStatus.FORBIDDEN, 'This email is already in use');
    }

    //  Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create User
      const hashedPassword = await bcryptHelper.hash(payload.password, 10);
      const user = await UserModel.create(
        [
          {
            email: payload.email,
            password: hashedPassword,
            role: UserRole.CLIENT,
          },
        ],
        { session },
      );

      if (!user[0]) throw new Error();

      const client = await ClientModel.create(
        [
          {
            user: user[0]._id,
            ...profileData,
          },
        ],
        {
          session,
        },
      );

      if (!client[0]) throw new Error();

      // Set profile id in user
      const userUpdateStatus = await UserModel.updateOne(
        {
          _id: user[0]._id,
        },
        {
          profileId: client[0]._id,
        },
        { session },
      );

      if (!userUpdateStatus.modifiedCount) throw new Error();

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      //  Return the created admin with populate user
      return ClientModel.findById(client[0]._id).populate('user');
    } catch (error) {
      // Rollback on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

export default new UserService();
