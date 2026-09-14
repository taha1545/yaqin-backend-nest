import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common'
import type { Response } from 'express'
import { User } from 'generated/prisma/client'
import { OtpService } from '@/modules/otp'
import type { ForgotPasswordDto, LoginDto, RegisterMemberDto, RegisterParentDto, RegisterTeacherDto, ResetPasswordDto, } from './dto'
import { PasswordService, AuthCookieService, AuthTokenService, GoogleProfile } from './utils'
import { AuthRepo } from './auth.repo'


@Injectable()
export class AuthService {

  constructor(private readonly repo: AuthRepo, private readonly password: PasswordService, private readonly tokens: AuthTokenService,
    private readonly cookies: AuthCookieService, private readonly otp: OtpService,) { }

  // Registration

  async registerParent(dto: RegisterParentDto,) {
    const user = await this.repo.transaction(async (tx) => {
      await this.repo.ensureEmailAvailable(dto.email, tx,);
      const password = await this.password.hash(dto.password);
      //
      return this.repo.createParent(
        {
          email: dto.email,
          name: dto.name,
          password,
          phone: dto.phone,
        },
        tx,
      )
    },)
    return this.buildAuthResult(user)
  }

  async registerTeacher(dto: RegisterTeacherDto,) {
    const user = await this.repo.transaction(async (tx) => {
      await this.repo.ensureEmailAvailable(dto.email, tx,);
      const password = await this.password.hash(dto.password);
      //
      return this.repo.createTeacher(
        {
          email: dto.email,
          name: dto.name,
          password,
          phone: dto.phone,
          level: dto.level,
          wilaya: dto.wilaya,
          school: dto.school,
          bio: dto.bio,
        }, tx,)
    },)
    return this.buildAuthResult(user)
  }

  async registerMember(dto: RegisterMemberDto,) {
    const user = await this.repo.transaction(async (tx) => {
      await this.repo.ensureEmailAvailable(dto.email, tx,);
      const password = await this.password.hash(dto.password);
      //
      return this.repo.createMember(
        {
          email: dto.email,
          name: dto.name,
          password,
          phone: dto.phone,
          target: dto.target,
        },
        tx,
      )
    },
    )
    return this.buildAuthResult(user)
  }


  // Authentication

  async login(dto: LoginDto) {
    const user = await this.repo.findByEmail(dto.email)
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials.');
    //
    const valid = await this.password.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials.',);
    //
    return this.buildAuthResult(user)
  }

  async refresh(refreshToken: string | undefined,) {
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token.');
    //
    let payload
    try {
      payload = await this.tokens.verifyRefreshToken(refreshToken)
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.')
    }
    //
    const user = await this.repo.findById(payload.sub)
    if (!user) throw new UnauthorizedException('Invalid or expired refresh token.');
    //
    const accessToken = await this.tokens.createAccessToken(user)
    return { accessToken }
  }

  logout(res: Response): void {
    //
    this.cookies.clearRefreshToken(res)
  }

  async getMe(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundException('User not found.',);
    //
    return this.repo.safeUser(user)
  }


  // Password Reset

  async forgotPassword(dto: ForgotPasswordDto,) {
    const user = await this.repo.findIdByEmail(dto.email)
    if (!user) throw new Error("no user found  with this email");
    //
    this.otp.sendOtp(user.id, dto.email, 'PASSWORD_RESET',).catch(() => { })
    //
    return { message: 'Password reset code sent to email.' }
  }

  async resetPassword(dto: ResetPasswordDto,) {
    const user = await this.repo.findIdByEmail(dto.email);
    if (!user) throw new BadRequestException('Invalid or expired reset code.');
    //
    await this.otp.verifyOtp(user.id, 'PASSWORD_RESET', dto.code,)
    //
    const password = await this.password.hash(dto.newPassword);
    await this.repo.updatePassword(user.id, password);
    //
    return {
      message: 'Password reset successfully.',
    }
  }


  // Google OAuth

  async handleGoogleLogin(profile: GoogleProfile,) {
    // existing user with this email
    const existing = await this.repo.findByEmail(profile.email);
    if (existing) {
      if (!existing.googleId) {
        const updated = await this.repo.attachGoogleId(existing.id, profile.googleId)
        return this.buildAuthResult(updated)
      }
      return this.buildAuthResult(existing)
    }
    // New Google account 
    const user = await this.repo.createGoogleParent({
      email: profile.email,
      name: profile.name,
      googleId: profile.googleId,
    })
    return this.buildAuthResult(user)
  }


  // helpers

  private async buildAuthResult<T extends User>(user: T) {
    const tokens = await this.tokens.createTokenPair(user);
    //
    return {
      user: this.repo.safeUser(user),
      ...tokens,
    }
  }

  setRefreshCookie(res: Response, refreshToken: string,): void {
    this.cookies.setRefreshToken(
      res,
      refreshToken,
    )
  }
}