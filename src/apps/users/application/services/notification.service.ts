import { Email, EmailState } from '@/users/domain';
import { User } from '@/users/domain';

export type TSendConfirmationEmail = {
  state: EmailState;
  to: string;
  from?: string;
  title?: string;
  body?: string;
  html?: string;
  user?: User;
};

export interface INotificationService {
  sendConfirmationEmail(params: Email): Promise<void>;

  sendForgotPasswordEmail(params: Email): Promise<void>;
}
