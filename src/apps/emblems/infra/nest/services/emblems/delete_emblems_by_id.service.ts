import {
  DeleteEmblemsByIdController,
  DeleteEmblemsByIdRequest,
  TDeleteEmblemsByIdRequest,
} from '@/emblems/interface/controllers/emblems';
import { PrismaEmblemsRepository } from '@/emblems/infra/prisma/repos/emblems';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteEmblemsByIdNestService {
  controller: DeleteEmblemsByIdController;

  constructor(emblemsRepository: PrismaEmblemsRepository) {
    this.controller = new DeleteEmblemsByIdController(emblemsRepository);
  }

  async execute(params: TDeleteEmblemsByIdRequest): Promise<void> {
    const request = new DeleteEmblemsByIdRequest({
      refId: params.refId,
    });

    const response = await this.controller.execute(request);

    return response;
  }
}
