import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

import { JwtTokenService } from '@/core/jwt'
import { PUBLIC_ROUTE_KEY } from '../constants'
import type { AuthenticatedRequest } from '../interfaces'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  //
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    if (this.isPublic(context)) return true;

    const token = this.extractBearerToken(request)
    if (!token) throw new UnauthorizedException('Missing access token.');

    const payload = await this.jwtTokenService.verifyAccessToken(token)
    request.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }
    return true
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
  }

  private extractBearerToken(request: Request): string | undefined {
    const header = request.headers.authorization
    if (!header) {
      return undefined
    }
    const [scheme, token] = header.split(' ')
    if (scheme?.toLowerCase() === 'bearer' && token) {
      return token
    }
    return undefined
  }
}
