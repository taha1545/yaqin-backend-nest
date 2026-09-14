import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth';

import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [AuthModule],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule { }