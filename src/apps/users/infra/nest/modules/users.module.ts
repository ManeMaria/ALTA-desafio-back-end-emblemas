import { Module } from '@nestjs/common';
import {
  ConfirmUserNestService,
  CreateUserForgotPasswordNestService,
  CreateUserNestService,
  GetUserByEmailNestService,
  NotificationService,
  PrismaUserConfirmationRepository,
  PrismaUserForgotPasswordRepository,
  PrismaUserRepository,
  UpdateUserForgotPasswordNestService,
  PrismaEmailRepository,
} from '@/users/infra';
import { PrismaModule } from '@/libs/prisma';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaUserRepository,
    PrismaUserConfirmationRepository,
    PrismaUserForgotPasswordRepository,
    GetUserByEmailNestService,
    CreateUserForgotPasswordNestService,
    UpdateUserForgotPasswordNestService,
    CreateUserNestService,
    ConfirmUserNestService,
    NotificationService,
    PrismaEmailRepository,
  ],
  exports: [
    CreateUserNestService,
    ConfirmUserNestService,
    GetUserByEmailNestService,
    CreateUserForgotPasswordNestService,
    UpdateUserForgotPasswordNestService,
    NotificationService,
  ],
})
export class UsersModule {}
