import { Domain, DomainEntity } from '@/core/domain';
import { User } from '@/users/domain';

export enum EmailState {
  PENDING = 'PENDING',
  SENT = 'SENT',
  ERROR = 'ERROR',
}

export interface Email extends Domain {
  state: EmailState;
  to: string;
  from?: string;
  title?: string;
  body?: string;
  html?: string;
  user?: User;
}

export class EmailEntity extends DomainEntity implements Email {
  state: EmailState;
  to: string;
  from: string;
  title?: string;
  body?: string;
  html?: string;
  user?: User;

  constructor(props: Partial<Email>) {
    super(props);

    this.state = props.state;
    this.to = props.to;
    this.from = props.from;
    this.title = props.title;
    this.body = props.body;
    this.html = props.html;
    this.user = props.user;
  }
}
