import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { MailService, PrismaService } from '@/core';
import { LoggerService } from '@/core/logger';
import { OtpType } from 'generated/prisma/client';

import { generateOtpCode, getOtpEmailBody, getOtpExpiry, getOtpSubject, hashOtpCode } from './otp.utils';

@Injectable()
export class OtpService {
  //
  constructor(private readonly prisma: PrismaService, private readonly mail: MailService, private readonly logger: LoggerService,) { }


  async sendOtp(userId: string, email: string, type: OtpType,): Promise<void> {
    //
    const code = generateOtpCode();
    const codeHash = await hashOtpCode(code);
    //
    await this.prisma.otp.create({
      data: {
        userId,
        type,
        code: codeHash,
        expiresAt: getOtpExpiry(),
      },
    });
    //
    try {
      await this.mail.send({ to: email, subject: getOtpSubject(type), html: getOtpEmailBody(type, code) });
      //
    } catch (error: unknown) {
      this.logger.error('Failed to send OTP email', String(error),);
    }
  }

  async verifyOtp(userId: string, type: OtpType, code: string,): Promise<void> {
    //
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        type,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!otp) throw new BadRequestException('Invalid or expired code.',);
    //
    const valid = await bcrypt.compare(code, otp.code);
    if (!valid) throw new BadRequestException('Invalid or expired code.',);
    //
    await this.prisma.otp.update({
      where: {
        id: otp.id,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

}