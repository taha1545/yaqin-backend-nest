import { SetMetadata } from '@nestjs/common';

import type { UserRole } from 'generated/prisma/client';

import { ROLES_ROUTE_KEY } from '../constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_ROUTE_KEY, roles);
