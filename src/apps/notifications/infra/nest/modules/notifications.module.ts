import { Module } from '@nestjs/common';
import {
  PrismaEmailRepository,
  PrismaEmailTemplateRepository,
} from '@/notifications/infra';
import { AwsModule, AwsSesEmailService } from '@/libs/aws';
import { PrismaModule } from '@/libs/prisma';

@Module({
  imports: [PrismaModule, AwsModule],
  providers: [
    PrismaEmailTemplateRepository,
    PrismaEmailRepository,
    AwsSesEmailService,
  ],
})
export class NotificationsModule {}
