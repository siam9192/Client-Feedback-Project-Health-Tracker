import { PaginationOptions } from '../types';
import { PAGINATION_OPTION_KEYS } from '../utils/constant';
import { pick } from '../utils/pick';

export enum ESortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

interface IOptionsResult {
  page: number;
  limit: number;
  skip: number;
  sortOrder: 1 | -1;
  sortBy: string;
}

interface IDefaultOptions {
  defaultSortBy?: string;
  defaultSortOrder?: ESortOrder;
  defaultPage?: number;
  defaultLimit?: number;
  limitOverride?: number;
}

export const calculatePagination = (
  paginationOptions: PaginationOptions,
  options?: IDefaultOptions,
): IOptionsResult => {
  // Parse pagination values with fallbacks
  let page: number =
    Number(paginationOptions.page) || options?.defaultPage || 1;
  let limit: number =
    Number(paginationOptions.limit) ||
    options?.limitOverride ||
    options?.defaultLimit ||
    10;

  const isValidSortOrder = Object.values(ESortOrder).includes(
    paginationOptions.sortOrder as ESortOrder,
  );
  let sortOrder: ESortOrder = isValidSortOrder
    ? (paginationOptions.sortOrder as ESortOrder)
    : options?.defaultSortOrder || ESortOrder.DESC;

  let sortBy: string =
    paginationOptions.sortBy || options?.defaultSortBy || 'createdAt';

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    sortOrder: sortOrder === ESortOrder.ASC ? 1 : -1,
    sortBy,
  };
};

// Strongly typed pick for pagination
export const paginationOptionPicker = (
  query: Record<string, any>,
): PaginationOptions =>
  pick(query, PAGINATION_OPTION_KEYS) as PaginationOptions;
