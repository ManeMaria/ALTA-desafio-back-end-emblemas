import {
  IUserForgotPasswordRepository,
  IUserRepository,
  UserForgotPasswordCodeWrongException,
  UserForgotPasswordExpiredException,
  UserForgotPasswordInvalidStateException,
  UserForgotPasswordMaxAttemptsException,
  UserForgotPasswordNotFoundException,
} from '@/users/application';
import { IUseCase } from '@/core/application';
import {
  User,
  UserForgotPassword,
  UserForgotPasswordState,
} from '@/users/domain';

export type TUpdateUserForgotPassword = {
  id: UserForgotPassword['id'];
  code: UserForgotPassword['code'];
  newPassword: User['password'];
};

export class UpdateUserForgotPasswordUseCase
  implements IUseCase<TUpdateUserForgotPassword, UserForgotPassword>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userForgotPasswordRepository: IUserForgotPasswordRepository,
    private readonly maxAttempts: number,
    private readonly expirationMs: number,
  ) {}

  async perform(data: TUpdateUserForgotPassword): Promise<UserForgotPassword> {
    const { id, code, newPassword } = data;

    const userForgotPasswordFound =
      await this.userForgotPasswordRepository.getById(id);

    this.checkIsValid(userForgotPasswordFound);

    if (this.hasExpired(userForgotPasswordFound)) {
      await this.expire(userForgotPasswordFound);
    }

    userForgotPasswordFound.attempts += 1;

    const isLastAttempt = userForgotPasswordFound.attempts >= this.maxAttempts;
    const isWrongCode = userForgotPasswordFound.code !== code;

    if (isWrongCode && isLastAttempt) {
      await this.decline(userForgotPasswordFound);
    }

    if (isWrongCode) {
      await this.userForgotPasswordRepository.update(userForgotPasswordFound);

      throw new UserForgotPasswordCodeWrongException({ id, code });
    }

    await this.updateUserPassword(userForgotPasswordFound.user, newPassword);

    const userForgotPasswordConfirmed = await this.confirm(
      userForgotPasswordFound,
    );

    return userForgotPasswordConfirmed;
  }

  checkIsValid(userForgotPassword: UserForgotPassword): void {
    if (!userForgotPassword) {
      throw new UserForgotPasswordNotFoundException({
        id: userForgotPassword.id,
      });
    }

    if (userForgotPassword.isDeclined()) {
      throw new UserForgotPasswordMaxAttemptsException({
        id: userForgotPassword.id,
        attempts: userForgotPassword.attempts,
      });
    }

    if (userForgotPassword.isExpired()) {
      throw new UserForgotPasswordExpiredException({
        id: userForgotPassword.id,
        expiredAt: userForgotPassword.expiredAt,
      });
    }

    if (userForgotPassword.isConfirmed()) {
      throw new UserForgotPasswordInvalidStateException({
        id: userForgotPassword.id,
        state: userForgotPassword.state,
      });
    }
  }

  hasExpired(userForgotPassword: UserForgotPassword): boolean {
    const nowInMs = new Date().getTime();
    const hasExpired =
      userForgotPassword.createdAt.getTime() + this.expirationMs <= nowInMs;

    return hasExpired;
  }

  async expire(userForgotPassword: UserForgotPassword): Promise<void> {
    userForgotPassword.state = UserForgotPasswordState.EXPIRED;
    userForgotPassword.expiredAt = new Date();

    await this.userForgotPasswordRepository.update(userForgotPassword);

    throw new UserForgotPasswordExpiredException({
      id: userForgotPassword.id,
      expiredAt: userForgotPassword.expiredAt,
    });
  }

  async decline(userForgotPassword: UserForgotPassword): Promise<void> {
    userForgotPassword.state = UserForgotPasswordState.DECLINED;
    userForgotPassword.declinedAt = new Date();

    await this.userForgotPasswordRepository.update(userForgotPassword);

    throw new UserForgotPasswordMaxAttemptsException({
      id: userForgotPassword.id,
      attempts: userForgotPassword.attempts,
      declinedAt: userForgotPassword.expiredAt,
    });
  }

  async updateUserPassword(
    user: User,
    password: User['password'],
  ): Promise<void> {
    user.password = password;
    await this.userRepository.update(user);
  }

  async confirm(
    userForgotPassword: UserForgotPassword,
  ): Promise<UserForgotPassword> {
    userForgotPassword.state = UserForgotPasswordState.CONFIRMED;
    userForgotPassword.confirmedAt = new Date();

    await this.userForgotPasswordRepository.update(userForgotPassword);

    const userForgotPasswordUpdated =
      await this.userForgotPasswordRepository.update(userForgotPassword);

    return userForgotPasswordUpdated;
  }
}
