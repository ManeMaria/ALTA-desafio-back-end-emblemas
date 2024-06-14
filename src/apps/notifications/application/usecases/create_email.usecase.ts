import { IUseCase } from '@/core/application';
import {
  Email,
  EmailEntity,
  EmailState,
  EmailTemplate,
} from '@/notifications/domain';
import {
  EmailTemplateNotFoundException,
  IEmailRepository,
  IEmailService,
  IEmailTemplateRepository,
} from '@/notifications/application';
import { User } from '@/users/domain';

export type TCreateEmail = Pick<Email, 'from' | 'to'> & {
  tag: EmailTemplate['tag'];
  user?: User;
  data?: Record<string, string>;
};

export class CreateEmailUseCase implements IUseCase<TCreateEmail, Email> {
  constructor(
    private readonly emailTemplateRepository: IEmailTemplateRepository,
    private readonly emailRepository: IEmailRepository,
    private readonly emailService: IEmailService,
  ) {}

  async perform(params: TCreateEmail): Promise<Email> {
    const { to, from, tag, user, data } = params;

    const template = await this.emailTemplateRepository.getByTag(tag);

    if (!template) {
      throw new EmailTemplateNotFoundException({ tag });
    }

    const { title, body, html } = template.extract(data);

    const email = new EmailEntity({
      state: EmailState.PENDING,
      template,
      to,
      from,
      title,
      body,
      html,
      ...(user && { user }),
    });

    const emailCreated = await this.emailRepository.save(email);

    try {
      await this.emailService.send(emailCreated);
      emailCreated.state = EmailState.SENT;
    } catch (error) {
      emailCreated.state = EmailState.ERROR;
    }

    const emailUpdated = await this.emailRepository.update(emailCreated);

    return emailUpdated;
  }
}
