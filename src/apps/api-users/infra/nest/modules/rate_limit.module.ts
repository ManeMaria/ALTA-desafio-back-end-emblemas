import { Module } from '@nestjs/common';
import { IORedisConfig } from '@/libs/ioredis';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IORedisConfig>) => ({
        ttl: 60,
        limit: 100,
        storage: new ThrottlerStorageRedisService(
          configService.get<string>('APP_REDIS_URL'),
        ),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RateLimitModule {}
