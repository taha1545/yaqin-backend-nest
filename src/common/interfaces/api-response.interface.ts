import type { PaginationMeta } from './pagination.interface';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> extends Omit<ApiResponse<T[]>, 'data'> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  details?: unknown;
}
