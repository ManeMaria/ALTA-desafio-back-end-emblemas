import { Domain, DomainEntity } from '@/core/domain';

export interface EmailTemplate extends Domain {
  tag: string;
  markups: string[];
  title?: string;
  body?: string;
  html?: string;
  extract(data?: Record<string, string>): EmailTemplateExtracted;
}

export type EmailTemplateExtracted = Pick<
  EmailTemplate,
  'title' | 'body' | 'html'
>;

export class EmailTemplateEntity extends DomainEntity implements EmailTemplate {
  tag: string;
  markups: string[];
  title?: string;
  body?: string;
  html?: string;

  constructor(props: Partial<EmailTemplate>) {
    super(props);

    this.tag = props.tag;
    this.title = props.title;
    this.body = props.body;
    this.html = props.html;

    Object.freeze(this);
  }

  extract(data?: Record<string, string>): EmailTemplateExtracted {
    const title = this.extractMessage(this.title, data);
    const body = this.extractMessage(this.body, data);
    const html = this.extractMessage(this.html, data);

    return {
      title,
      body,
      html,
    };
  }

  private extractMessage(
    template?: string,
    data?: Record<string, string>,
  ): string {
    if (!template) {
      return null;
    }

    if (template && !data) {
      return template;
    }

    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{ *${key} *}}`, 'g');
      template = template.replace(regex, data[key]);
    });

    return template;
  }
}
