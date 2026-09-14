import { Body, Controller, Post, Res } from '@nestjs/common'
import type { Response } from 'express'
import { Public } from '@/common/decorators'
import { AdminAuthService } from './auth.service'
import { AdminLoginDto } from './dto/login.dto'

@Controller('admin')
export class AdminAuthController {
    //
    constructor(private readonly service: AdminAuthService) { }

    @Post('login')
    @Public()
    login(
        @Body() dto: AdminLoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.service.login(dto, res)
    }
}