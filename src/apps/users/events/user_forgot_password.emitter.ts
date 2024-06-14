import { UserForgotPassword } from '@/users/domain';

export type TUserForgotPasswordEvent = UserForgotPassword;

export interface IUserForgotPasswordEventEmitter {
  created(userForgotPassword: TUserForgotPasswordEvent): void;
  confirmed(userForgotPassword: TUserForgotPasswordEvent): void;
}
