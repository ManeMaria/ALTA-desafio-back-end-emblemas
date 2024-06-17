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
  PrismaEmblemsRepository,
  PrismaRedeemEmblemsRepository,
  CreateRedeemEmblemNestService,
  GetRedeemEmblemByUserIdNestService,
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
    PrismaEmblemsRepository,
    PrismaRedeemEmblemsRepository,
    CreateRedeemEmblemNestService,
    GetRedeemEmblemByUserIdNestService,
  ],
  exports: [
    CreateUserNestService,
    ConfirmUserNestService,
    GetUserByEmailNestService,
    CreateUserForgotPasswordNestService,
    UpdateUserForgotPasswordNestService,
    NotificationService,
    CreateRedeemEmblemNestService,
    GetRedeemEmblemByUserIdNestService,
  ],
})
export class UsersModule {}
