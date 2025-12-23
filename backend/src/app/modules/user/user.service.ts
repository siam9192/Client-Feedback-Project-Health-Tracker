import AppError from '../../errors/AppError';
import httpStatus from '../../utils/http-status';
import { PaginationOptions } from '../../types';
import { calculatePagination } from '../../helpers/pagination.helper';
import { AuthUser } from '../auth/auth.interface';
import {
  CreateAdminPayload,
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
    const user = await UserModel.findById(userId);
    // Check user existence
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    let profile;

    switch (role) {
      case UserRole.CLIENT: {
        const client = await ClientModel.findById(profileId).lean();
        if (!client || !client.user)
          throw new Error('Client profile not found');

        const { user, _id, userId, name, ...others } = client;

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

        const { user, _id, userId, name, ...others } = employee;

        profile = {
          _id,
          ...others,
        };
        break;
      }

      case UserRole.ADMIN: {
        const admin = await AdminModel.findById(profileId).lean();
        if (!admin || !admin.user) throw new Error('Admin profile not found');

        const { user, _id, userId, name, ...others } = admin;

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
    const user = await UserModel.findById(id);
    // Check user existence
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    const { profileId, role } = user;

    let profile;

    switch (role) {
      case UserRole.CLIENT: {
        const client = await ClientModel.findById(profileId).lean();
        if (!client || !client.user)
          throw new Error('Client profile not found');

        const { user, _id, userId, name, ...others } = client;

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

        const { user, _id, userId, name, ...others } = employee;

        profile = {
          _id,
          ...others,
        };
        break;
      }

      case UserRole.ADMIN: {
        const admin = await AdminModel.findById(profileId).lean();
        if (!admin || !admin.user) throw new Error('Admin profile not found');

        const { user, _id, userId, name, ...others } = admin;

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
    const { searchTerm, notIn, select, ...others } = filterQuery;
    const { page, skip, limit, sortBy, sortOrder } =
      calculatePagination(paginationOptions);
    const whereConditions: any = {};

    if (searchTerm) {
      whereConditions.$or = [
        {
          name: { $regex: searchTerm, $options: 'i' },
          'user.email': { $regex: searchTerm, $options: 'i' },
        },
      ];
    }

    if (notIn) {
      // Convert string to array
      const notInIds = notIn.split(',').map((id) => id.trim());

      if (notInIds.length) {
        // Check for invalid ObjectIds
        const invalidId = notInIds.find((id) => !Types.ObjectId.isValid(id));
        if (invalidId) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            `Invalid ID in notIn filter: ${invalidId}`,
          );
        }

        // Set others filter key into whereConditions
        if (Object.values(others).length) {
          Object.entries(others).forEach(([key, value]) => {
            if (!value) return;
            whereConditions[key] = value;
          });
        }

        // Use $nin to exclude these IDs
        whereConditions._id = {
          $nin: notInIds.map((id) => new Types.ObjectId(id)),
        };
      }
    }

    const findQuery = AdminModel.find(whereConditions)
      .populate('user')
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(skip)
      .limit(limit);

    if (select) {
      findQuery.select(select);
    }

    const admins = await findQuery.exec();

    const totalResults = await AdminModel.countDocuments(whereConditions);

    return {
      data: admins,
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
    const whereConditions: any = {};

    if (searchTerm) {
      whereConditions.$or = [
        {
          name: { $regex: searchTerm, $options: 'i' },
          'user.email': { $regex: searchTerm, $options: 'i' },
        },
      ];
    }

    if (notIn) {
      // Convert string to array
      const notInIds = notIn.split(',').map((id) => id.trim());

      if (notInIds.length) {
        // Check for invalid ObjectIds
        const invalidId = notInIds.find((id) => !Types.ObjectId.isValid(id));
        if (invalidId) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            `Invalid ID in notIn filter: ${invalidId}`,
          );
        }

        // Set others filter key into whereConditions
        if (Object.values(others).length) {
          Object.entries(others).forEach(([key, value]) => {
            if (!value) return;
            whereConditions[key] = value;
          });
        }

        // Use $nin to exclude these IDs
        whereConditions._id = {
          $nin: notInIds.map((id) => new Types.ObjectId(id)),
        };
      }
    }

    const findQuery = EmployeeModel.find(whereConditions)
      .populate('user')
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(skip)
      .limit(limit);

    if (select) {
      findQuery.select(select);
    }

    const employees = await findQuery.exec();

    const totalResults = await EmployeeModel.countDocuments(whereConditions);

    return {
      data: employees,
      meta: {
        page,
        limit,
        totalResults,
      },
    };
  }

  async getAdmins(
    filterQuery: UsersFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    const { searchTerm, notIn, select, ...others } = filterQuery;
    const { page, skip, limit, sortBy, sortOrder } =
      calculatePagination(paginationOptions);
    const whereConditions: any = {};

    if (searchTerm) {
      whereConditions.$or = [
        {
          name: { $regex: searchTerm, $options: 'i' },
          'user.email': { $regex: searchTerm, $options: 'i' },
        },
      ];
    }

    if (notIn) {
      // Convert string to array
      const notInIds = notIn.split(',').map((id) => id.trim());

      if (notInIds.length) {
        // Check for invalid ObjectIds
        const invalidId = notInIds.find((id) => !Types.ObjectId.isValid(id));
        if (invalidId) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            `Invalid ID in notIn filter: ${invalidId}`,
          );
        }

        // Set others filter key into whereConditions
        if (Object.values(others).length) {
          Object.entries(others).forEach(([key, value]) => {
            if (!value) return;
            whereConditions[key] = value;
          });
        }

        // Use $nin to exclude these IDs
        whereConditions._id = {
          $nin: notInIds.map((id) => new Types.ObjectId(id)),
        };
      }
    }

    const findQuery = AdminModel.find(whereConditions)
      .populate('user')
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(skip)
      .limit(limit);

    if (select) {
      findQuery.select(select);
    }

    const admins = await findQuery.exec();

    const totalResults = await AdminModel.countDocuments(whereConditions);

    return {
      data: admins,
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
            userId: user[0]._id,
            user: user[0]._id,
            ...profileData,
          },
        ],
        {
          session,
        },
      );

      if (!admin[0]) throw new Error();

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
            userId: user[0]._id,
            user: user[0]._id,
            ...profileData,
          },
        ],
        {
          session,
        },
      );

      if (!employee[0]) throw new Error();

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

  async createClient(payload: CreateEmployeePayload) {
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
            userId: user[0]._id,
            user: user[0]._id,
            ...profileData,
          },
        ],
        {
          session,
        },
      );

      if (!client[0]) throw new Error();

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
