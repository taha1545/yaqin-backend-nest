import { Injectable } from '@nestjs/common'
import { JwtTokenService } from '@/core'
import { UserRole } from 'generated/prisma/client'

@Injectable()
export class AuthTokenService {
    //
    constructor(private readonly jwt: JwtTokenService) { }

    async createTokenPair(user: { id: string, email: string, role: UserRole }) {
        return this.jwt.signTokenPair({
            sub: user.id,
            email: user.email,
            role: user.role,
        })
    }

    async createAccessToken(user: { id: string, email: string, role: UserRole }): Promise<string> {
        return this.jwt.signAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        })
    }

    async verifyRefreshToken(token: string) {
        return this.jwt.verifyRefreshToken(token)
    }
}