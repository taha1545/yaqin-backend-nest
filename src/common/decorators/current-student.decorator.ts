import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { StudentRequest, StudentSelf } from '../interfaces';

export const CurrentStudent = createParamDecorator(
  (property: keyof StudentSelf | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<StudentRequest>();
    //
    const student = request.student;
    if (!student) {
      return undefined;
    }
    //
    return property ? student[property] : student;
  },
);
