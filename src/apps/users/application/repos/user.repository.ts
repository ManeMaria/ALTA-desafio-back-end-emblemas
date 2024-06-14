import { User } from '@/users/domain';
import { DefaultFilters } from '@/core/domain';
import { IRepository } from '@/core/application';

export type UserFilters = DefaultFilters & {
  name?: string;
  email?: string;
};

export interface IUserRepository extends IRepository<User, UserFilters> {
  getByEmail(email: string): Promise<User | null>;
  getByIdAndEmail(id: User['id'], email: User['email']): Promise<User>;
}
