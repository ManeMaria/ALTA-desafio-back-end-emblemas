import { Email } from '@/users/domain';

export interface IEmailRepository {
  save(email: Email): Promise<Email>;
  update(email: Email): Promise<Email>;
}
