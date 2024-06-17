import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/libs/prisma';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users.module';
import { AuthModule } from './auth.module';
import { RateLimitModule } from './rate_limit.module';
import { NodemailerModule } from '@/libs/nodemailer';
import { EmblemsModule } from './emblems.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    JwtModule,
    AuthModule,
    UsersModule,
    RateLimitModule,
    NodemailerModule,
    EmblemsModule,
  ],
})
export class ApiUsersModule {}
