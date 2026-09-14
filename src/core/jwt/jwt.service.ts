import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { JwtSignOptions } from '@nestjs/jwt';
import type { AppConfig } from '@/config';
import type { JwtPayload, JwtTokenPayload, TokenPair } from './jwt.types';

@Injectable()
export class JwtTokenService {
  //
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: AppConfig['auth']['jwt']['refreshExpiresIn'];

  constructor(private readonly jwt: JwtService, config: ConfigService<AppConfig, true>,) {
    this.refreshSecret = config.get('auth.jwt.refreshSecret', { infer: true, });
    this.refreshExpiresIn = config.get('auth.jwt.refreshExpiresIn', { infer: true, });
  }

  async signAccessToken(payload: JwtTokenPayload): Promise<string> {
    return this.jwt.signAsync({ ...payload, type: 'access' });
  }

  async signRefreshToken(payload: JwtTokenPayload): Promise<string> {
    return this.jwt.signAsync(
      {
        ...payload,
        type: 'refresh',
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as JwtSignOptions['expiresIn'],
      },
    );
  }


  async signTokenPair(payload: JwtTokenPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }


  async verifyAccessToken(token: string): Promise<JwtPayload> {
    const payload = await this.verify(token);
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid access token.');
    }
    return payload;
  }


  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const payload = await this.verify(token, this.refreshSecret);
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    return payload;
  }


  private async verify(token: string, secret?: string): Promise<JwtPayload> {
    try {
      return await this.jwt.verifyAsync<JwtPayload>(token, { ...(secret && { secret }) });
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
