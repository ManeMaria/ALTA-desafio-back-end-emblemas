import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaEmblemsRepository } from '@/emblems/infra/prisma/repos/emblems';
import {
  CreateEmblemsNestService,
  DeleteEmblemsByIdNestService,
  GetEmblemsByIdNestService,
  GetEmblemssByFilterNestService,
  UpdateEmblemsNestService,
} from '@/emblems/infra/nest/services/emblems';
import { PrismaModule } from '@/libs/prisma';
import { PrismaUserRepository } from '@/users/infra';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  providers: [
    PrismaEmblemsRepository,
    PrismaUserRepository,
    CreateEmblemsNestService,
    DeleteEmblemsByIdNestService,
    GetEmblemsByIdNestService,
    GetEmblemssByFilterNestService,
    UpdateEmblemsNestService,
  ],
  exports: [
    CreateEmblemsNestService,
    DeleteEmblemsByIdNestService,
    GetEmblemsByIdNestService,
    GetEmblemssByFilterNestService,
    UpdateEmblemsNestService,
  ],
})
export class EmblemsModule {}
