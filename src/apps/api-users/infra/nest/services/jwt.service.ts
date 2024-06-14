import {
  AccessToken,
  AuthUser,
  RefreshToken,
  RefreshTokenCache,
} from '@/api-users/domain';
import { MissingEnvVarException } from '@/core/application';
import { IORedisService } from '@/libs/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { randomUUID as uuid } from 'node:crypto';

const HOUR_IN_MILISECONDS = 86400000;
const MONTH_IN_MILISECONDS = 2592000000;

export interface JwtTokenServiceConfig {
  APP_JWT_ACCESS_TOKEN_VERSION: number;
  APP_JWT_ACCESS_TOKEN_SECRET: string;
  APP_JWT_ACCESS_TOKEN_EXPIRES_IN: number;
  APP_JWT_REFRESH_TOKEN_EXPIRES_IN: number;
}

@Injectable()
export class JwtTokenService {
  private readonly accessTokenVersion: number;
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;
  private readonly ACCESS_TOKEN_DEFAULT_VERSION = 1;
  private readonly ACCESS_TOKEN_DEFAULT_EXPIRES_IN = HOUR_IN_MILISECONDS;
  private readonly REFRESH_TOKEN_DEFAULT_EXPIRES_IN = MONTH_IN_MILISECONDS;

  constructor(
    private readonly configService: ConfigService<JwtTokenServiceConfig>,
    private readonly jwtService: JwtService,
    private readonly redisService: IORedisService,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      'APP_JWT_ACCESS_TOKEN_SECRET',
    );

    if (!this.accessTokenSecret) {
      throw new MissingEnvVarException('APP_JWT_ACCESS_TOKEN_SECRET');
    }

    this.accessTokenVersion = Number(
      this.configService.get<number>(
        'APP_JWT_ACCESS_TOKEN_VERSION',
        this.ACCESS_TOKEN_DEFAULT_VERSION,
      ),
    );

    this.accessTokenExpiresIn = Number(
      this.configService.get<number>(
        'APP_JWT_ACCESS_TOKEN_EXPIRES_IN',
        this.ACCESS_TOKEN_DEFAULT_EXPIRES_IN,
      ),
    );

    this.refreshTokenExpiresIn = Number(
      this.configService.get<number>(
        'APP_JWT_ACCESS_TOKEN_EXPIRES_IN',
        this.REFRESH_TOKEN_DEFAULT_EXPIRES_IN,
      ),
    );
  }

  async generate(user: AuthUser): Promise<string> {
    const options: JwtSignOptions = {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiresIn,
    };

    const refreshToken: RefreshToken = {
      id: uuid(),
      eat: new Date(Date.now() + this.refreshTokenExpiresIn),
    };

    const refreshTokenCache: RefreshTokenCache = {
      user,
      refreshToken,
    };

    await this.redisService.set<RefreshTokenCache>({
      key: `refresh-token-users-${user.id}`,
      data: refreshTokenCache,
      ttl: this.refreshTokenExpiresIn,
    });

    const data: AccessToken = {
      version: this.accessTokenVersion,
      id: user.id,
      email: user.email,
      refresh_token: refreshToken,
    };

    const token = this.jwtService.sign(data, options);

    return token;
  }

  decodeWithoutExpiration(plain: string): AccessToken {
    const options: JwtVerifyOptions = {
      secret: this.accessTokenSecret,
      ignoreExpiration: true,
    };

    const decoded: AccessToken = this.jwtService.verify(plain, options);

    return decoded;
  }
}
