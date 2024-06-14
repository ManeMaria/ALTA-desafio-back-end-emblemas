import { Module } from '@nestjs/common';
import { AwsService } from '@/libs/aws';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
