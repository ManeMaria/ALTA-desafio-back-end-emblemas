import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IORedisService } from '@/libs/ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [IORedisService],
  exports: [IORedisService],
})
export class IORedisModule {}
