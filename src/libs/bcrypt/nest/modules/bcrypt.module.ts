import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from '@/libs/bcrypt';

@Module({
  imports: [ConfigModule],
  providers: [BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {}
