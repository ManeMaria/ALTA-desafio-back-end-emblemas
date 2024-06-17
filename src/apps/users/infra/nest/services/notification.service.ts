import { Email } from '@/users/domain';
import { INotificationService } from '@/users/application';
import { Injectable } from '@nestjs/common';
import { NodeMailerService } from '@/libs/nodemailer';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(private readonly nodeMailerService: NodeMailerService) {}

  async sendConfirmationEmail(params: Email): Promise<void> {
    await this.nodeMailerService.send(params);
  }

  async sendForgotPasswordEmail(params: Email): Promise<void> {
    await this.nodeMailerService.send(params);
  }
}
