import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type VerifyCallback } from 'passport-google-oauth20';

import type { AppConfig } from '@/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(config: ConfigService<AppConfig, true>) {
    super({
      clientID: config.get('google.clientId', { infer: true }) ?? '',
      clientSecret: config.get('google.clientSecret', { infer: true }) ?? '',
      callbackURL: config.get('google.callbackUrl', { infer: true }) ?? '',
      scope: ['email', 'profile'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(_accessToken: string, _refreshToken: string,
    profile: {
      id: string;
      emails?: Array<{ value: string; verified?: boolean }>;
      name?: { givenName?: string; familyName?: string };
    }, done: VerifyCallback,): Promise<void> {
    //
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('Google account does not provide an email.'));
    //
    const name = profile.name?.givenName
      ? `${profile.name.givenName} ${profile.name.familyName ?? ''}`.trim()
      : "userRandom";
    //
    done(null, {
      email,
      name,
      googleId: profile.id,
    });
  }
}
