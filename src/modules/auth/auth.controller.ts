import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport'

import { CurrentUser, Public } from '@/common/decorators'
import { AuthService } from './auth.service'
import { ForgotPasswordDto, LoginDto, RegisterMemberDto, RegisterParentDto, RegisterTeacherDto, ResetPasswordDto } from './dto'

@Controller('auth')
export class AuthController {
  //
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register/parent')
  @HttpCode(HttpStatus.CREATED)
  async registerParent(@Body() dto: RegisterParentDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.registerParent(dto)
    this.authService.setRefreshCookie(res, result.refreshToken)
    return { user: result.user, accessToken: result.accessToken }
  }

  @Public()
  @Post('register/teacher')
  @HttpCode(HttpStatus.CREATED)
  async registerTeacher(@Body() dto: RegisterTeacherDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.registerTeacher(dto)
    this.authService.setRefreshCookie(res, result.refreshToken)
    return { user: result.user, accessToken: result.accessToken }
  }

  @Public()
  @Post('register/member')
  @HttpCode(HttpStatus.CREATED)
  async registerMember(@Body() dto: RegisterMemberDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.registerMember(dto)
    this.authService.setRefreshCookie(res, result.refreshToken)
    return { user: result.user, accessToken: result.accessToken }
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto)
    this.authService.setRefreshCookie(res, result.refreshToken)
    return { user: result.user, accessToken: result.accessToken }
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.refresh_token
    return this.authService.refresh(refreshToken)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.logout(res)
    return { message: 'Logged out successfully.' }
  }

  @Get('me')
  async me(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId)
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto)
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() { }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const profile = req.user as {
      email: string
      name: string
      picture?: string
      googleId: string
    }
    const result = await this.authService.handleGoogleLogin(profile)
    this.authService.setRefreshCookie(res, result.refreshToken)
    return { user: result.user, accessToken: result.accessToken }
  }
}
