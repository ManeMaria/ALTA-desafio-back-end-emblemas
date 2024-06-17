import {
  UpdateEmblemsController,
  UpdateEmblemsRequest,
  UpdateEmblemsResponse,
  TUpdateEmblemsRequest,
} from '@/emblems/interface/controllers/emblems';
import { PrismaEmblemsRepository } from '@/emblems/infra/prisma/repos/emblems';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateEmblemsNestService {
  controller: UpdateEmblemsController;

  constructor(emblemsRepository: PrismaEmblemsRepository) {
    this.controller = new UpdateEmblemsController(emblemsRepository);
  }

  async execute(params: TUpdateEmblemsRequest): Promise<UpdateEmblemsResponse> {
    const request = new UpdateEmblemsRequest(params);

    const response = await this.controller.execute(request);

    return response;
  }
}
