import { Injectable } from '@nestjs/common'
import type { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import type { AppConfig } from '@/config'
import type { CookieOptions } from './types'

const REFRESH_TOKEN_COOKIE = 'refresh_token'

@Injectable()
export class AuthCookieService {
    //
    constructor(private readonly config: ConfigService<AppConfig, true>) { }

    setRefreshToken(
        res: Response,
        refreshToken: string,
    ): void {
        res.cookie(
            REFRESH_TOKEN_COOKIE,
            refreshToken,
            this.cookieOptions(),
        )
    }

    clearRefreshToken(res: Response): void {
        res.clearCookie(
            REFRESH_TOKEN_COOKIE,
            this.cookieOptions(),
        )
    }

    private cookieOptions(): CookieOptions {
        const cookie = this.config.get('cookie', {
            infer: true,
        })
        //
        const expiresIn = this.config.get(
            'auth.jwt.refreshExpiresIn',
            {
                infer: true,
            },
        )
        //
        return {
            httpOnly: true,
            secure: cookie.secure,
            sameSite: cookie.sameSite,
            domain: cookie.domain || undefined,
            maxAge: this.parseExpiryToMs(expiresIn),
        }
    }

    private parseExpiryToMs(expiry: string): number {
        const match = /^([0-9]+)([dhms])$/.exec(expiry)
        if (!match) {
            return 7 * 24 * 60 * 60 * 1000
        }
        //
        const value = Number(match[1])
        const unit = match[2] as 'd' | 'h' | 'm' | 's'
        const multipliers = {
            d: 24 * 60 * 60 * 1000,
            h: 60 * 60 * 1000,
            m: 60 * 1000,
            s: 1000,
        }
        //
        return value * multipliers[unit]
    }
}