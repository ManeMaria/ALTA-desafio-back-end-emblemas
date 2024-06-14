import { EmailTemplate as EmailTemplateInPrisma } from '@prisma/client';
import { EmailTemplate, EmailTemplateEntity } from '@/notifications/domain';
import { IEmailTemplateRepository } from '@/notifications/application';
import { PrismaService } from '@/libs/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaEmailTemplateRepository implements IEmailTemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  static toDomain(emailTemplateInPrisma: EmailTemplateInPrisma): EmailTemplate {
    return new EmailTemplateEntity({
      id: emailTemplateInPrisma.id,
      serial: emailTemplateInPrisma.serial,
      tag: emailTemplateInPrisma.tag,
      markups: emailTemplateInPrisma.markups,
      title: emailTemplateInPrisma.title,
      body: emailTemplateInPrisma.body,
      html: emailTemplateInPrisma.html,
      createdAt: emailTemplateInPrisma.createdAt,
      updatedAt: emailTemplateInPrisma.updatedAt,
      deletedAt: emailTemplateInPrisma.deletedAt,
    });
  }

  async getByTag(tag: EmailTemplate['tag']): Promise<EmailTemplate> {
    const emailTemplateFound = await this.prisma.emailTemplate.findUnique({
      where: { tag },
    });

    if (!emailTemplateFound) {
      return null;
    }

    return PrismaEmailTemplateRepository.toDomain(emailTemplateFound);
  }
}
