import {
  CreateUserController,
  CreateUserRequest,
  CreateUserResponse,
  TCreateUserRequest,
} from '@/users/interface';
import {
  NotificationService,
  PrismaUserConfirmationRepository,
  PrismaUserRepository,
  PrismaEmailRepository,
} from '@/users/infra';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserNestService {
  controller: CreateUserController;

  constructor(
    userRepository: PrismaUserRepository,
    notificationService: NotificationService,
    userConfirmationRepository: PrismaUserConfirmationRepository,
    emailRepository: PrismaEmailRepository,
  ) {
    this.controller = new CreateUserController(
      userConfirmationRepository,
      userRepository,
      notificationService,
      emailRepository,
    );
  }

  async execute(params: TCreateUserRequest): Promise<CreateUserResponse> {
    const request = new CreateUserRequest(params);

    const response = await this.controller.execute(request);

    return response;
  }
}
