import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { OtpModule } from '@/modules/otp'

import { AuthController } from './auth.controller'
import { AuthRepo } from './auth.repo'
import { AuthService } from './auth.service'
import { PasswordService, AuthCookieService, AuthTokenService } from './utils'
import { GoogleStrategy } from './strategies'

@Module({
  imports: [
    PassportModule.register({ session: false }),
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepo,
    PasswordService,
    AuthTokenService,
    AuthCookieService,
    GoogleStrategy,
  ],
  exports: [
    AuthService,
    PasswordService,
    AuthTokenService,
    AuthCookieService,
  ],
})
export class AuthModule { }