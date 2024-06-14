import { User, UserForgotPassword } from '@/users/domain';

export interface IUserForgotPasswordRepository {
  getById(id: UserForgotPassword['id']): Promise<UserForgotPassword>;
  save(userForgotPassword: UserForgotPassword): Promise<UserForgotPassword>;
  update(userForgotPassword: UserForgotPassword): Promise<UserForgotPassword>;
  getByUserAndIsPending(userForgotPassword: User): Promise<UserForgotPassword>;
}
