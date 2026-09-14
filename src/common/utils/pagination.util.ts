import type { PaginationDto } from '../dto';
import type { PaginatedResult, PaginationMeta } from '../interfaces';

export function getPaginationSlice(pagination: PaginationDto): { skip: number; take: number } {
  return { skip: pagination.skip, take: pagination.take };
}

export function toPaginationMeta(total: number, pagination: PaginationDto): PaginationMeta {
  return {
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages: Math.ceil(total / pagination.limit),
  };
}

export function paginated<T>(
  data: T[],
  total: number,
  pagination: PaginationDto,
): PaginatedResult<T> {
  return { data, meta: toPaginationMeta(total, pagination) };
}
