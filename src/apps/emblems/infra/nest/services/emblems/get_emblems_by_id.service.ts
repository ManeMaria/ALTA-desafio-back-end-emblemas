import {
  GetEmblemsByIdController,
  GetEmblemsByIdRequest,
  GetEmblemsByIdResponse,
  TGetEmblemsByIdRequest,
} from '@/emblems/interface/controllers/emblems';
import { PrismaEmblemsRepository } from '@/emblems/infra/prisma/repos/emblems';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetEmblemsByIdNestService {
  controller: GetEmblemsByIdController;

  constructor(emblemsRepository: PrismaEmblemsRepository) {
    this.controller = new GetEmblemsByIdController(emblemsRepository);
  }

  async execute(
    params: TGetEmblemsByIdRequest,
  ): Promise<GetEmblemsByIdResponse> {
    const request = new GetEmblemsByIdRequest({
      refId: params.refId,
    });

    const response = await this.controller.execute(request);

    return response;
  }
}
