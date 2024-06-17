import { Email } from '@/users/domain';

export interface IEmailService {
  send(email: Email): Promise<void>;
}
