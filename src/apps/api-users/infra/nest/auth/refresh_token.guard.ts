import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IORedisService } from '@/libs/ioredis';
import { JwtTokenService } from '@/api-users/infra';
import { RefreshTokenCache } from '@/apps/api-users/domain';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly redisService: IORedisService,
    private readonly jwtService: JwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { body } = request;

    if (!body?.access_token) {
      throw new UnauthorizedException();
    }

    const token: string = body['access_token'];
    const tokenDecoded = this.jwtService.decodeWithoutExpiration(token);

    const cached = await this.redisService.get<RefreshTokenCache>(
      `refresh-token-users-${tokenDecoded['id']}`,
    );

    if (cached) {
      const { data } = cached;

      if (data.refreshToken.id === tokenDecoded['refresh_token']['id']) {
        request.user = data.user;
        return true;
      } else {
        throw new UnauthorizedException();
      }
    }

    return false;
  }
}
