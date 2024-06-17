import {
  CreateEmblemsController,
  CreateEmblemsRequest,
  CreateEmblemsResponse,
  TCreateEmblemsRequest,
} from '@/emblems/interface/controllers/emblems';
import { PrismaEmblemsRepository } from '@/emblems/infra/prisma/repos/emblems';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateEmblemsNestService {
  controller: CreateEmblemsController;

  constructor(emblemsRepository: PrismaEmblemsRepository) {
    this.controller = new CreateEmblemsController(emblemsRepository);
  }

  async execute(params: TCreateEmblemsRequest): Promise<CreateEmblemsResponse> {
    const request = new CreateEmblemsRequest(params);

    const response = await this.controller.execute(request);

    return response;
  }
}
