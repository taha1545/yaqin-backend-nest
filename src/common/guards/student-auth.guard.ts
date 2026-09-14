import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

import { PrismaService } from '@/core';
import type { StudentRequest, StudentSelf } from '../interfaces';

import { STUDENT_CODE_HEADER } from '../constants';

@Injectable()
export class StudentAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<StudentRequest>();

    const code = request.headers[STUDENT_CODE_HEADER];
    if (!code || typeof code !== 'string') {
      throw new UnauthorizedException('Missing student code.');
    }

    const student = await this.prisma.student.findUnique({
      where: { code: code },
    });

    if (!student) {
      throw new UnauthorizedException('Invalid student code.');
    }

    const studentSelf: StudentSelf = {
      code: student.code,
      fullName: student.fullName,
      gradeCode: student.gradeCode,
    };
    request.student = studentSelf;

    return true;
  }
}
