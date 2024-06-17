import { Email as EmailInPrisma } from '@prisma/client';
import { Email, EmailEntity, EmailState } from '@/users/domain';
import { PrismaService } from '@/libs/prisma';
import { IEmailRepository } from '@/users/application';
import { UserEntity } from '@/users/domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaEmailRepository implements IEmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  static toDomain(emailInPrisma: EmailInPrisma): Email {
    const user =
      emailInPrisma.userId &&
      new UserEntity({
        id: emailInPrisma.userId,
      });

    return new EmailEntity({
      id: emailInPrisma.id,
      serial: emailInPrisma.serial,
      state: EmailState[emailInPrisma.state],
      to: emailInPrisma.to,
      from: emailInPrisma.from,
      title: emailInPrisma.title,
      body: emailInPrisma.body,
      html: emailInPrisma.html,
      user,
      createdAt: emailInPrisma.createdAt,
      updatedAt: emailInPrisma.updatedAt,
      deletedAt: emailInPrisma.deletedAt,
    });
  }

  async save(email: Email): Promise<Email> {
    const emailCreated = await this.prisma.email.create({
      data: {
        id: email.id,
        state: email.state,
        to: email.to,
        from: email.from,
        title: email.title,
        body: email.body,
        html: email.html,

        user: {
          connect: {
            id: email.user?.id,
          },
        },
      },
    });

    return PrismaEmailRepository.toDomain(emailCreated);
  }

  async update(email: Email): Promise<Email> {
    const emailUpdated = await this.prisma.email.update({
      where: {
        id: email.id,
      },
      data: {
        state: email.state,
        userId: email.user?.id,
        to: email.to,
        from: email.from,
        title: email.title,
        body: email.body,
        html: email.html,
      },
    });

    return PrismaEmailRepository.toDomain(emailUpdated);
  }
}
