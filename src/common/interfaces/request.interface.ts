import type { Request } from 'express';

import type { AuthenticatedUser, StudentSelf } from './auth.interface';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface StudentRequest extends Request {
  student?: StudentSelf;
}
