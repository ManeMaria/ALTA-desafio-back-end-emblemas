import { UserForgotPassword as UserForgotPasswordInPrisma } from '@prisma/client';
import {
  User,
  UserForgotPassword,
  UserForgotPasswordEntity,
  UserForgotPasswordState,
  UserEntity,
} from '@/users/domain';
import { IUserForgotPasswordRepository } from '@/users/application';
import { PrismaService } from '@/libs/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserForgotPasswordRepository
  implements IUserForgotPasswordRepository
{
  constructor(private readonly prisma: PrismaService) {}

  static toDomain(
    userConfirmationInPrisma: UserForgotPasswordInPrisma,
  ): UserForgotPassword {
    const user = new UserEntity({
      id: userConfirmationInPrisma.userId,
    });

    return new UserForgotPasswordEntity({
      id: userConfirmationInPrisma.id,
      serial: userConfirmationInPrisma.serial,
      state: UserForgotPasswordState[userConfirmationInPrisma.state],
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

  async save(entity: UserForgotPassword): Promise<UserForgotPassword> {
    const userCreated = await this.prisma.userForgotPassword.create({
      data: {
        id: entity.id,
        state: entity.state,
        code: entity.code,
        attempts: entity.attempts,
        email: entity.email,
        userId: entity.user.id,
      },
    });

    return PrismaUserForgotPasswordRepository.toDomain(userCreated);
  }

  async getByUserAndIsPending(user: User): Promise<UserForgotPassword> {
    const userConfirmationFound =
      await this.prisma.userForgotPassword.findFirst({
        where: { userId: user.id, state: UserForgotPasswordState.PENDING },
      });

    if (!userConfirmationFound) {
      return null;
    }

    return PrismaUserForgotPasswordRepository.toDomain(userConfirmationFound);
  }

  async update(
    userConfirmation: UserForgotPassword,
  ): Promise<UserForgotPassword> {
    const userConfirmationUpdate = await this.prisma.userForgotPassword.update({
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

    return PrismaUserForgotPasswordRepository.toDomain(userConfirmationUpdate);
  }

  async getById(id: string): Promise<UserForgotPassword> {
    const userConfirmationFound =
      await this.prisma.userForgotPassword.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

    if (!userConfirmationFound) {
      return null;
    }

    return PrismaUserForgotPasswordRepository.toDomain(userConfirmationFound);
  }
}
