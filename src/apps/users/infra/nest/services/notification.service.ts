import { Email } from '@/notifications/domain';
import { INotificationService } from '@/users/application';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@/users/domain';
import { MissingEnvVarException } from '@/core/application';

export interface NotificationServiceConfig {
  APP_CONFIRMATION_EMAIL_SENDER: string;
  APP_CONFIRMATION_EMAIL_TAG: string;
  APP_FORGOT_PASSWORD_EMAIL_SENDER: string;
  APP_FORGOT_PASSWORD_EMAIL_TAG: string;
}

@Injectable()
export class NotificationService implements INotificationService {
  CONFIRMATION_EMAIL_SENDER: string;
  CONFIRMATION_EMAIL_TAG: string;
  FORGOT_PASSWORD_EMAIL_SENDER: string;
  FORGOT_PASSWORD_EMAIL_TAG: string;

  constructor(
    private readonly configService: ConfigService<NotificationServiceConfig>,
  ) {
    this.CONFIRMATION_EMAIL_TAG = this.configService.get<string>(
      'APP_CONFIRMATION_EMAIL_TAG',
    );

    if (!this.CONFIRMATION_EMAIL_TAG) {
      throw new MissingEnvVarException('APP_CONFIRMATION_EMAIL_TAG');
    }

    this.CONFIRMATION_EMAIL_SENDER = this.configService.get<string>(
      'APP_CONFIRMATION_EMAIL_SENDER',
    );

    if (!this.CONFIRMATION_EMAIL_SENDER) {
      throw new MissingEnvVarException('APP_CONFIRMATION_EMAIL_SENDER');
    }

    this.FORGOT_PASSWORD_EMAIL_SENDER = this.configService.get<string>(
      'APP_FORGOT_PASSWORD_EMAIL_SENDER',
    );

    if (!this.FORGOT_PASSWORD_EMAIL_SENDER) {
      throw new MissingEnvVarException('APP_FORGOT_PASSWORD_EMAIL_SENDER');
    }

    this.FORGOT_PASSWORD_EMAIL_TAG = this.configService.get<string>(
      'APP_FORGOT_PASSWORD_EMAIL_TAG',
    );

    if (!this.FORGOT_PASSWORD_EMAIL_TAG) {
      throw new MissingEnvVarException('APP_FORGOT_PASSWORD_EMAIL_TAG');
    }
  }

  async sendConfirmationEmail(
    to: Email['to'],
    userId: User['id'],
    name: User['name'],
    code: string,
  ): Promise<void> {
    const event = {
      from: this.CONFIRMATION_EMAIL_SENDER,
      to,
      tag: this.CONFIRMATION_EMAIL_TAG,
      userId,
      data: {
        name,
        code,
      },
    };
  }

  async sendForgotPasswordEmail(
    to: Email['to'],
    userId: User['id'],
    name: User['name'],
    code: string,
  ): Promise<void> {
    const event = {
      from: this.FORGOT_PASSWORD_EMAIL_SENDER,
      to,
      tag: this.FORGOT_PASSWORD_EMAIL_TAG,
      userId,
      data: {
        name,
        code,
      },
    };
  }
}
