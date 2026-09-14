import { Injectable, UnauthorizedException, } from '@nestjs/common'
import type { Response } from 'express'
import { PrismaService } from '@/core'
import { AuthCookieService, AuthTokenService, PasswordService } from '@/modules/auth/utils'
import { AdminLoginDto } from './dto/login.dto'

@Injectable()
export class AdminAuthService {
    //
    constructor(
        private readonly prisma: PrismaService,
        private readonly tokens: AuthTokenService,
        private readonly password: PasswordService,
        private readonly cookies: AuthCookieService,
    ) { }

    async login(dto: AdminLoginDto, res: Response) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
            },
        })
        //
        if (!user || user.role !== 'ADMIN' || !user.password) {
            throw new UnauthorizedException('Invalid credentials.');
        }
        //
        const valid = await this.password.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials.');
        //
        const tokens = await this.tokens.createTokenPair({ id: user.id, email: user.email, role: user.role })
        this.cookies.setRefreshToken(res, tokens.refreshToken)
        //
        return {
            accessToken: tokens.accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }
    }
}