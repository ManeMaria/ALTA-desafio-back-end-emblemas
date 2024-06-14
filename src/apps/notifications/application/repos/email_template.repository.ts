import { EmailTemplate } from '@/notifications/domain';

export interface IEmailTemplateRepository {
  getByTag(tag: EmailTemplate['tag']): Promise<EmailTemplate>;
}
