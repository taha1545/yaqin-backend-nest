import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, } from '@nestjs/common';
import type { Response } from 'express';

import type { ApiErrorResponse } from '../interfaces';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  //
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    //
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    //
    const statusCode = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttpException ? this.resolveMessage(exception) : 'Internal server error';
    //
    if (!isHttpException) {
      this.logger.error('Unhandled exception', exception);
    }
    //
    const body: ApiErrorResponse = {
      success: false,
      statusCode,
      message,
    };
    //
    const details = this.resolveDetails(exception);
    if (details !== undefined) {
      body.details = details;
    }
    response.status(statusCode).json(body);
  }

  private resolveMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }
    //
    if (response && typeof response === 'object' && 'message' in response) {
      const raw = response.message;
      return Array.isArray(raw) ? raw.join(', ') : String(raw);
    }
    //
    return exception.message;
  }

  private resolveDetails(exception: unknown): unknown {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (response && typeof response === 'object' && 'details' in response) {
        return response.details;
      }
    }
    return undefined;
  }
}
