import { Email } from '@/notifications/domain';

export interface IEmailService {
  send(email: Email): Promise<void>;
}
