import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';

import { Public } from '@/common/decorators';

import { LoginMemberDto, SignupMemberDto } from './dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignupMemberDto) {
    return this.service.signup(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginMemberDto, @Res({ passthrough: true }) res: Response) {
    return this.service.login(dto, res);
  }
}