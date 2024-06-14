import {
  GetUserByEmailController,
  GetUserByEmailRequest,
  GetUserByEmailResponse,
  TGetUserByEmailRequest,
} from '@/users/interface';
import { PrismaUserRepository } from '@/users/infra';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserByEmailNestService {
  controller: GetUserByEmailController;

  constructor(userRepository: PrismaUserRepository) {
    this.controller = new GetUserByEmailController(userRepository);
  }

  async execute(
    params: TGetUserByEmailRequest,
  ): Promise<GetUserByEmailResponse> {
    const request = new GetUserByEmailRequest({
      email: params.email,
    });

    const response = await this.controller.execute(request);

    return response;
  }
}
