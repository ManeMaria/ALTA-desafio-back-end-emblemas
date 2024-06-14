import {
  CreateUserController,
  CreateUserRequest,
  CreateUserResponse,
  TCreateUserRequest,
} from '@/users/interface';
import { PrismaUserRepository } from '@/users/infra';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserNestService {
  controller: CreateUserController;

  constructor(userRepository: PrismaUserRepository) {
    this.controller = new CreateUserController(userRepository);
  }

  async execute(params: TCreateUserRequest): Promise<CreateUserResponse> {
    const request = new CreateUserRequest({
      name: params.email,
      email: params.email,
      password: params.password,
    });

    const response = await this.controller.execute(request);

    return response;
  }
}
