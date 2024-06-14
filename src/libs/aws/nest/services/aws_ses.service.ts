import AWS from 'aws-sdk';
import { Email } from '@/apps/notifications/domain';
import { IEmailService } from '@/notifications/application';
import { AwsService } from './aws.service';
import { AwsSesException } from '@/libs/aws';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsSesEmailService implements IEmailService {
  private readonly ses: AWS.SES;

  constructor(private readonly awsService: AwsService) {
    this.ses = new AWS.SES(this.awsService.getConfig());
  }

  async send(email: Email): Promise<void> {
    const params: AWS.SES.Types.SendEmailRequest = {
      Source: email.from,
      Destination: {
        ToAddresses: [email.to],
      },
      Message: {
        Subject: { Data: email.title },
        Body: {
          ...(email.html ? { Html: { Data: email.html } } : {}),
          ...(email.body ? { Text: { Data: email.body } } : {}),
        },
      },
    };

    return new Promise((resolve, reject) => {
      this.ses.sendEmail(params, (err, _) => {
        if (err) {
          reject(new AwsSesException(err));
          return;
        }

        resolve();
      });
    });
  }
}
