import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from 'generated/prisma/client';

import { ROLES_ROUTE_KEY } from '../constants';
import type { AuthenticatedRequest } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    //
    if (!user) {
      throw new ForbiddenException('Authentication required.');
    }
    if (!roles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource.');
    }
    //
    return true;
  }
}
