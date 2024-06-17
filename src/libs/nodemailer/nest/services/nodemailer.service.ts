import { MissingEnvVarException } from '@/core/application';
import { IEmailService } from '@/apps/users/application';
import { MailerService } from '@nestjs-modules/mailer';
import { NodemailerConfig, NodemailerException } from '@/libs/nodemailer';
import { Email } from '@/users/domain';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

// Converter as chaves para uma tupla
type TupleOfKeys<T> = {
  [K in keyof T]: K;
}[];

const envs: TupleOfKeys<keyof NodemailerConfig> = [
  'NODEMAILER_HOST',
  'NODEMAILER_PORT',
  'NODEMAILER_SECURE',
  'NODEMAILER_USER',
  'NODEMAILER_PASS',
];

@Injectable()
export class NodeMailerService implements IEmailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService<NodemailerConfig>,
  ) {
    envs.forEach((key) => {
      if (!this.configService.get<string>(key)) {
        throw new MissingEnvVarException(key);
      }
    });
  }

  async send(email: Email) {
    const url = `example.com/auth/confirm?token`;
    try {
      await this.mailerService.sendMail({
        to: email.to,
        from: email.from,
        subject: email.title,
        html: email.html,
        context: {
          name: email.user.name,
          url,
        },
      });
    } catch (error) {
      throw new NodemailerException(error);
    }
  }
}
