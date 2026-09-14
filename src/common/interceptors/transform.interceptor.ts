import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MESSAGE_ROUTE_KEY } from '../constants';
import type { ApiResponse, PaginatedApiResponse, PaginatedResult } from '../interfaces';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<unknown> | PaginatedApiResponse<unknown>> {
    const message = this.reflector.getAllAndOverride<string>(MESSAGE_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return next.handle().pipe(map((data) => this.wrap(data, message)));
  }

  private wrap(
    data: unknown,
    message?: string,
  ): ApiResponse<unknown> | PaginatedApiResponse<unknown> {
    if (this.isPaginatedResult(data)) {
      return { success: true, data: data.data, meta: data.meta, message };
    }
    return { success: true, data, message };
  }

  private isPaginatedResult(value: unknown): value is PaginatedResult<unknown> {
    return !!value && typeof value === 'object' && 'data' in value && 'meta' in value;
  }
}
