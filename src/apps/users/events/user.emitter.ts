import { User } from '@/users/domain';

export type TUserEvent = User;

export interface IUserEventEmitter {
  created(user: TUserEvent): void;
  confirmed(user: TUserEvent): void;
}
