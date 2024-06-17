import { Module } from '@nestjs/common';
import {
  CreateEmblemsRestController,
  DeleteEmblemsByIdRestController,
  GetEmblemsByIdRestController,
  GetEmblemssByFilterRestController,
  UpdateEmblemsRestController,
} from '@/api-users/infra/nest/controllers/emblems';
import { PrismaModule } from '@/libs/prisma';
import { EmblemsModule as MEmblemsModule } from '@/emblems/infra/nest/modules';

@Module({
  imports: [PrismaModule, MEmblemsModule],
  controllers: [
    CreateEmblemsRestController,
    GetEmblemssByFilterRestController,
    GetEmblemsByIdRestController,
    UpdateEmblemsRestController,
    DeleteEmblemsByIdRestController,
  ],
})
export class EmblemsModule {}
