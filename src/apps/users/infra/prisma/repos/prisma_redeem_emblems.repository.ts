import { Emblems, EmblemsEntity } from '@/users/domain';
import {
  IRedeemEmblemsRepository,
  RedeemEmblemsRepository,
} from '@/users/application';
import { PrismaService } from '@/libs/prisma';
import { Injectable } from '@nestjs/common';

type RedeemEmblemsEntity = {
  emblemsId: string;
  id: string;
  userId: string;
  emblems: Emblems;
};

@Injectable()
export class PrismaRedeemEmblemsRepository implements IRedeemEmblemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  static toDomain(emblemsInPrisma: RedeemEmblemsEntity): RedeemEmblemsEntity {
    const emblems = new EmblemsEntity(emblemsInPrisma.emblems);
    return {
      emblemsId: emblemsInPrisma.emblemsId,
      id: emblemsInPrisma.id,
      userId: emblemsInPrisma.userId,
      emblems,
    };
  }

  async save(entity: RedeemEmblemsRepository): Promise<RedeemEmblemsEntity> {
    const { emblemsId, userId } = entity;
    const emblemsCreated = await this.prisma.emblemsToUsers.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        emblems: {
          connect: {
            refId: emblemsId,
          },
        },
      },

      include: {
        emblems: true,
      },
    });

    return PrismaRedeemEmblemsRepository.toDomain(emblemsCreated);
  }

  async getByUserId(userId: string): Promise<Emblems[] | null> {
    const emblemsFounds = await this.prisma.emblemsToUsers.findMany({
      where: {
        userId,
      },
      include: {
        emblems: true,
      },
    });

    return emblemsFounds.map((emblem) => new EmblemsEntity(emblem.emblems));
  }
}
