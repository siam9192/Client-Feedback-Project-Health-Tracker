import { model, Schema } from 'mongoose';
import {
  Address,
  Admin,
  Client,
  ClientType,
  ContactInfo,
  Employee,
  EmploymentType,
  Gender,
  User,
  UserRole,
  UserStatus,
} from './user.interface';

const AddressSchema = new Schema<Address>(
  {
    street: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    postcode: { type: String },
  },
  { _id: false },
);

const ContactInfoSchema = new Schema<ContactInfo>(
  {
    email: {
      type: String,
      minlength: 5,
      maxlength: 50,
      trim: true,
    },
    phone: {
      type: String,
      minlength: 8,
      maxlength: 15,
      trim: true,
    },
  },
  { _id: false },
);

const UserModelSchema = new Schema<User>(
  {
    email: {
      type: String,
      unique: true,
      minLength: 5,
      maxLength: 50,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      enum: Object.values(UserRole),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },

    profileId: {
      type: Schema.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const EmployeeModelSchema = new Schema<Employee>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      trim: true,
      required: true,
    },
    position: {
      type: String,
      minLength: 2,
      maxLength: 30,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
      required: true,
    },
    address: AddressSchema,
    contactInfo: ContactInfoSchema,
    count: {
      runningProjects: { type: Number, min: 0, default: 0 },
      completedProjects: { type: Number, min: 0, default: 0 },
      overdueProjects: { type: Number, min: 0, default: 0 },
    },
  },
  { timestamps: true },
);

const ClientModelSchema = new Schema<Client>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    clientType: {
      type: String,
      enum: Object.values(ClientType),
      required: true,
    },
    address: { type: AddressSchema, required: true },
    contactInfo: ContactInfoSchema,
    count: {
      runningProjects: { type: Number, min: 0, default: 0 },
      completedProjects: { type: Number, min: 0, default: 0 },
      overdueProjects: { type: Number, min: 0, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

const AdminModelSchema = new Schema<Admin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<User>('user', UserModelSchema);
export const AdminModel = model<Admin>('admin', AdminModelSchema);
export const EmployeeModel = model<Employee>('employee', EmployeeModelSchema);
export const ClientModel = model<Client>('employee', ClientModelSchema);
