import {
  CreateUserForgotPasswordController,
  CreateUserForgotPasswordRequest,
  CreateUserForgotPasswordResponse,
  TCreateUserForgotPasswordRequest,
} from '@/users/interface';
import {
  NotificationService,
  PrismaEmailRepository,
  PrismaUserForgotPasswordRepository,
  PrismaUserRepository,
} from '@/users/infra';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserForgotPasswordNestService {
  controller: CreateUserForgotPasswordController;

  constructor(
    userRepository: PrismaUserRepository,
    userForgotPasswordRepository: PrismaUserForgotPasswordRepository,
    notificationService: NotificationService,
    emailRepository: PrismaEmailRepository,
  ) {
    this.controller = new CreateUserForgotPasswordController(
      userRepository,
      userForgotPasswordRepository,
      notificationService,
      emailRepository,
    );
  }

  async execute(
    params: TCreateUserForgotPasswordRequest,
  ): Promise<CreateUserForgotPasswordResponse> {
    const request = new CreateUserForgotPasswordRequest({
      email: params.email,
    });

    const response = await this.controller.execute(request);

    return response;
  }
}
