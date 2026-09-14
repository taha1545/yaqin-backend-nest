import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { UserRole } from 'generated/prisma/client';

import { PrismaService } from '@/core';
import { toSafeUser } from '@/common/utils';
import { AuthCookieService, AuthTokenService, PasswordService } from '@/modules/auth/utils';

import type { LoginMemberDto, SignupMemberDto } from './dto';

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly tokens: AuthTokenService,
    private readonly cookies: AuthCookieService,
  ) {}

  async signup(dto: SignupMemberDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (existing) throw new ConflictException('Email is already registered.');

    const password = await this.password.hash(dto.password);

    await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password,
        phone: dto.phone,
        role: UserRole.MEMBER,
        isVerified: false,
        member: {
          create: {
            target: dto.target,
          },
        },
      },
    });

    return {
      message: 'Member account created. Please wait for an admin to verify your account before logging in.',
    };
  }

  async login(dto: LoginMemberDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        member: true,
      },
    });
    if (!user || user.role !== UserRole.MEMBER || !user.password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const valid = await this.password.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials.');

    if (!user.isVerified) {
      throw new ForbiddenException('Your account is not verified yet. Please wait for an admin to verify it.');
    }

    const tokens = await this.tokens.createTokenPair({ id: user.id, email: user.email, role: user.role });
    this.cookies.setRefreshToken(res, tokens.refreshToken);

    return { user: toSafeUser(user), accessToken: tokens.accessToken };
  }
}