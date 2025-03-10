import { Module } from '@nestjs/common';
import {
  ConfirmUserRestController,
  CreateUserRestController,
  JwtTokenService,
  CreateRedeemEmblemRestController,
  GetRedeemEmblemByUserIdRestController,
} from '@/api-users/infra';
import { JwtModule } from '@nestjs/jwt';
import { IORedisModule } from '@/libs/ioredis';
import { BcryptModule } from '@/libs/bcrypt';
import { UsersModule as MUsersModule } from '@/users/infra';

@Module({
  imports: [MUsersModule, JwtModule, IORedisModule, BcryptModule],
  controllers: [
    CreateUserRestController,
    ConfirmUserRestController,
    CreateRedeemEmblemRestController,
    GetRedeemEmblemByUserIdRestController,
  ],
  providers: [JwtTokenService],
})
export class UsersModule {}
