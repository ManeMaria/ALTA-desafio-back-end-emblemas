import {
  GetEmblemssByFilterController,
  GetEmblemssByFilterRequest,
  TGetEmblemssByFilterResponse,
  TGetEmblemssByFilterRequest,
} from '@/emblems/interface/controllers/emblems';
import { PrismaEmblemsRepository } from '@/emblems/infra/prisma/repos/emblems';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetEmblemssByFilterNestService {
  controller: GetEmblemssByFilterController;

  constructor(emblemsRepository: PrismaEmblemsRepository) {
    this.controller = new GetEmblemssByFilterController(emblemsRepository);
  }

  async execute(
    params: TGetEmblemssByFilterRequest,
  ): Promise<TGetEmblemssByFilterResponse> {
    const request = new GetEmblemssByFilterRequest(params);

    const response = await this.controller.execute(request);

    return response;
  }
}
