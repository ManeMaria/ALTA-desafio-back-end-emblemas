import {
  CreateRedeemEmblemController,
  CreateRedeemEmblemRequest,
  TCreateRedeemEmblemRequest,
  TCreateRedeemEmblemResponse,
} from '@/apps/users/interface';
import {
  PrismaUserRepository,
  PrismaRedeemEmblemsRepository,
  PrismaEmblemsRepository,
} from '@/users/infra';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateRedeemEmblemNestService {
  controller: CreateRedeemEmblemController;

  constructor(
    redeemEmblemRepository: PrismaRedeemEmblemsRepository,
    emblemsRepository: PrismaEmblemsRepository,
    userRepository: PrismaUserRepository,
  ) {
    this.controller = new CreateRedeemEmblemController(
      redeemEmblemRepository,
      emblemsRepository,
      userRepository,
    );
  }

  async execute(
    params: TCreateRedeemEmblemRequest,
  ): Promise<TCreateRedeemEmblemResponse> {
    const request = new CreateRedeemEmblemRequest(params);

    await this.controller.execute(request);
  }
}
