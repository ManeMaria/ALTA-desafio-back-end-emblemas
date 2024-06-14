import { DefaultException, ExceptionTypes } from '@/core/application';
import { EmailTemplate } from '@/notifications/domain';

export class EmailTemplateNotFoundException extends DefaultException {
  constructor(emailTemplate: Partial<EmailTemplate>) {
    super({
      type: ExceptionTypes.SYSTEM,
      code: 'EMAIL_TEMPLATE_NOT_FOUND',
      data: emailTemplate,
    });
  }
}
