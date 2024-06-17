import {
  Emblems as EmblemsInPrisma,
  User as UserInPrisma,
} from '@prisma/client';
import { Order, Pagination } from '@/core/domain';
import { Emblems, EmblemsEntity } from '@/emblems/domain/entities/emblems';
import {
  IEmblemsRepository,
  EmblemsFilters,
} from '@/emblems/application/repos/emblems';
import { PrismaService } from '@/libs/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaEmblemsRepository implements IEmblemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  static toDomain(
    emblemsInPrisma: EmblemsInPrisma & {
      user?: UserInPrisma;
    },
  ): Emblems {
    return new EmblemsEntity({
      id: emblemsInPrisma.id,
      name: emblemsInPrisma.name,
      image: emblemsInPrisma.image,
      refId: emblemsInPrisma.refId,
      slug: emblemsInPrisma.slug,
      createdAt: emblemsInPrisma.createdAt,
      updatedAt: emblemsInPrisma.updatedAt,
      deletedAt: emblemsInPrisma.deletedAt,
    });
  }

  async save(entity: Emblems): Promise<Emblems> {
    const emblemsCreated = await this.prisma.emblems.create({
      data: entity,
    });

    return PrismaEmblemsRepository.toDomain(emblemsCreated);
  }

  async getById(id: string): Promise<Emblems | null> {
    const emblemsFound = await this.prisma.emblems.findUnique({
      where: { refId: id },
    });

    if (!emblemsFound) {
      return null;
    }

    return PrismaEmblemsRepository.toDomain(emblemsFound);
  }

  async getBySlug(slug: string): Promise<Emblems> {
    const emblemsFound = await this.prisma.emblems.findFirst({
      where: { slug },
    });

    if (!emblemsFound) {
      return null;
    }

    return PrismaEmblemsRepository.toDomain(emblemsFound);
  }

  async getByFilter(
    filter: EmblemsFilters,
    order: Order,
    pagination: Pagination,
  ): Promise<Emblems[]> {
    const emblemssFound = await this.prisma.emblems.findMany({
      where: {
        ...filter,
        name: { contains: filter.name, mode: 'insensitive' },
        slug: { contains: filter.slug },
      },
      take: pagination.take,
      skip: pagination.skip,
      orderBy: { [order.property]: order.mode },
    });

    return emblemssFound.map((emblemsFound) =>
      PrismaEmblemsRepository.toDomain(emblemsFound),
    );
  }

  async count(filter: EmblemsFilters): Promise<number> {
    const emblemssCount = await this.prisma.emblems.count({
      where: {
        ...filter,
        name: { contains: filter.name, mode: 'insensitive' },
        slug: { contains: filter.slug },
      },
    });

    return emblemssCount;
  }

  async update(entity: Emblems): Promise<Emblems> {
    const emblemsUpdated = await this.prisma.emblems.update({
      where: { refId: entity.refId },
      data: entity,
    });

    return PrismaEmblemsRepository.toDomain(emblemsUpdated);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.emblems.delete({
      where: { refId: id },
    });
  }
}
