import { UserRole } from '../modules/user/user.interface';

export const PAGINATION_OPTION_KEYS = ['page', 'limit', 'sortBy', 'sortOrder'];

export const GLOBAL_ERROR_MESSAGE =
  'Oops! There is something happened wrong.Please try again later';

export const ALL_USER_ROLES = Object.values(UserRole);
