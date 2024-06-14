import { User } from '@/users/domain';

export type AuthUser = Omit<User, 'password' | 'deletedAt' | 'isConfirmed'>;
