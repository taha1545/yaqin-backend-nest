import type { UserRole } from 'generated/prisma/client';

export type { JwtPayload, TokenPair } from '@/core/jwt';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface StudentSelf {
  code: string;
  fullName: string;
  gradeCode: string;
}
