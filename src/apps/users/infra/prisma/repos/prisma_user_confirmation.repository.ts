import { UserConfirmation as UserConfirmationInPrisma } from '@prisma/client';
import {
  User,
  UserConfirmation,
  UserConfirmationEntity,
  UserConfirmationState,
  UserEntity,
} from '@/users/domain';
import { IUserConfirmationRepository } from '@/users/application';
import { PrismaService } from '@/libs/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserConfirmationRepository
  implements IUserConfirmationRepository
{
  constructor(private readonly prisma: PrismaService) {}

  static toDomain(
    userConfirmationInPrisma: UserConfirmationInPrisma,
  ): UserConfirmation {
    const user = new UserEntity({
      id: userConfirmationInPrisma.userId,
    });

    return new UserConfirmationEntity({
      id: userConfirmationInPrisma.id,
      serial: userConfirmationInPrisma.serial,
      state: UserConfirmationState[userConfirmationInPrisma.state],
      code: userConfirmationInPrisma.code,
      attempts: userConfirmationInPrisma.attempts,
      email: userConfirmationInPrisma.email,
      user,
      confirmedAt: userConfirmationInPrisma.confirmedAt,
      expiredAt: userConfirmationInPrisma.expiredAt,
      declinedAt: userConfirmationInPrisma.declinedAt,
      createdAt: userConfirmationInPrisma.createdAt,
      updatedAt: userConfirmationInPrisma.updatedAt,
      deletedAt: userConfirmationInPrisma.deletedAt,
    });
  }

  async save(entity: UserConfirmation): Promise<UserConfirmation> {
    const userCreated = await this.prisma.userConfirmation.create({
      data: {
        id: entity.id,
        state: entity.state,
        code: entity.code,
        attempts: entity.attempts,
        email: entity.email,
        userId: entity.user.id,
      },
    });

    return PrismaUserConfirmationRepository.toDomain(userCreated);
  }

  async getByUser(user: User): Promise<UserConfirmation> {
    const userConfirmationFound = await this.prisma.userConfirmation.findFirst({
      where: { userId: user.id },
    });

    if (!userConfirmationFound) {
      return null;
    }

    return PrismaUserConfirmationRepository.toDomain(userConfirmationFound);
  }

  async update(userConfirmation: UserConfirmation): Promise<UserConfirmation> {
    const userConfirmationUpdate = await this.prisma.userConfirmation.update({
      where: {
        id: userConfirmation.id,
      },
      data: {
        state: userConfirmation.state,
        attempts: userConfirmation.attempts,
        confirmedAt: userConfirmation.confirmedAt,
        expiredAt: userConfirmation.expiredAt,
        declinedAt: userConfirmation.declinedAt,
      },
    });

    return PrismaUserConfirmationRepository.toDomain(userConfirmationUpdate);
  }
}
