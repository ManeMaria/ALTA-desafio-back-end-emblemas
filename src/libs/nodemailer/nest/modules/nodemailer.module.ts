import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodeMailerService } from '@/libs/nodemailer';

@Global()
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRoot({
      transport: {
        host: String(process.env.NODEMAILER_HOST),
        port: Number(process.env.NODEMAILER_PORT),
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      },
    }),
  ],
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
export class NodemailerModule {}
