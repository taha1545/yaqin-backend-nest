import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { HttpExceptionFilter } from './filters';
import { JwtAuthGuard, RolesGuard, StudentAuthGuard } from './guards';
import { TransformInterceptor } from './interceptors';

@Global()
@Module({
  providers: [
    JwtAuthGuard,
    RolesGuard,
    StudentAuthGuard,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
  exports: [JwtAuthGuard, RolesGuard, StudentAuthGuard],
})
export class CommonModule { }
