import { randomInt } from 'node:crypto';
import bcrypt from 'bcrypt';
import type { OtpType } from 'generated/prisma/client';


export const OTP_EXPIRES_MINUTES = 15;

export function generateOtpCode(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashOtpCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export function getOtpExpiry(): Date {
  return new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);
}

export function getOtpSubject(type: OtpType): string {
  const subjects: Record<OtpType, string> = {
    EMAIL_VERIFICATION: 'Email verification code',
    PASSWORD_RESET: 'Password reset code',
  };
  return subjects[type];
}

export function getOtpEmailBody(type: OtpType, code: string,): string {
  //
  const action = type.toLowerCase().replaceAll('_', ' ');
  return `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px;">
      <h2 style="margin-bottom: 20px;">Yaqin</h2>

      <p>Your ${action} code is:</p>

      <div style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        padding: 15px;
        margin: 20px 0;
        background: #f5f5f5;
        text-align: center;
        border-radius: 8px;
      ">
        ${code}
      </div>

      <p style="color: #666;">
        This code expires in ${OTP_EXPIRES_MINUTES} minutes.
      </p>

      <p style="color: #999; font-size: 13px;">
        If you didn't request this code, you can ignore this email.
      </p>
    </div>
  `;
}