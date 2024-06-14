import { Module } from '@nestjs/common';
import {
  CreateForgotPasswordRestController,
  JwtAuthGuard,
  JwtStrategy,
  JwtTokenService,
  LocalStrategy,
  LoginRestController,
  RefreshTokenGuard,
  RefreshTokenRestController,
  UpdateForgotPasswordRestController,
} from '@/api-users/infra';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/infra';
import { IORedisModule } from '@/libs/ioredis';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { BcryptModule } from '@/libs/bcrypt';
import { NotificationsModule } from '@/apps/notifications/infra';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    PassportModule,
    UsersModule,
    IORedisModule,
    BcryptModule,
    NotificationsModule,
  ],
  controllers: [
    LoginRestController,
    RefreshTokenRestController,
    CreateForgotPasswordRestController,
    UpdateForgotPasswordRestController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtTokenService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenGuard,
  ],
})
export class AuthModule {}
