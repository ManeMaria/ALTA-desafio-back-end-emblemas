import {
  GetRedeemEmblemByUserIdController,
  GetRedeemEmblemByUserIdItem,
  GetRedeemEmblemByUserIdRequest,
  TGetRedeemEmblemByUserIdRequest,
  TGetRedeemEmblemByUserIdResponse,
} from '@/apps/users/interface';

import { Injectable } from '@nestjs/common';
import {
  PrismaUserRepository,
  PrismaRedeemEmblemsRepository,
} from '@/users/infra';

@Injectable()
export class GetRedeemEmblemByUserIdNestService {
  controller: GetRedeemEmblemByUserIdController;

  constructor(
    redeemEmblemRepository: PrismaRedeemEmblemsRepository,
    userRepository: PrismaUserRepository,
  ) {
    this.controller = new GetRedeemEmblemByUserIdController(
      redeemEmblemRepository,
      userRepository,
    );
  }

  async execute(
    params: TGetRedeemEmblemByUserIdRequest,
  ): Promise<TGetRedeemEmblemByUserIdResponse> {
    const request = new GetRedeemEmblemByUserIdRequest(params);

    const response = await this.controller.execute(request);

    return response.map((emblem) => new GetRedeemEmblemByUserIdItem(emblem));
  }
}
