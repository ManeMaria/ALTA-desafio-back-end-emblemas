import {
  User,
  UserConfirmation,
  UserConfirmationState,
  UserState,
} from '@/users/domain';
import {
  IUserConfirmationRepository,
  IUserRepository,
  UserConfirmationInvalidStateException,
  UserInvalidStateException,
  UserNotFoundException,
  UserConfirmationNotFoundException,
  UserConfirmationCodeWrongException,
  UserConfirmationMaxAttemptsException,
  UserConfirmationExpiredException,
} from '@/users/application';
import { IUseCase } from '@/core/application';

export type TConfirmUser = { email: User['email']; code: string };

export class ConfirmUserUseCase implements IUseCase<TConfirmUser, User> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userConfirmationRepository: IUserConfirmationRepository,
    private readonly maxAttempts: number,
    private readonly expirationMs: number,
  ) {}

  async perform(data: TConfirmUser): Promise<User> {
    const { email, code } = data;

    const userFound = await this.userRepository.getByEmail(email);

    if (!userFound) {
      throw new UserNotFoundException({ email });
    }

    if (userFound.state !== UserState.PENDING_CONFIRMATION) {
      throw new UserInvalidStateException({ email });
    }

    const userConfirmationFound =
      await this.userConfirmationRepository.getByUser(userFound);

    this.checkIsValid(userConfirmationFound);

    if (this.hasExpired(userConfirmationFound)) {
      await this.expire(userConfirmationFound);
    }

    userConfirmationFound.attempts += 1;

    const isLastAttempt = userConfirmationFound.attempts >= this.maxAttempts;
    const isWrongCode = userConfirmationFound.code !== code;

    if (isWrongCode && isLastAttempt) {
      await this.decline(userConfirmationFound);
    }

    if (isWrongCode) {
      await this.userConfirmationRepository.update(userConfirmationFound);

      throw new UserConfirmationCodeWrongException({ code });
    }

    await this.confirm(userConfirmationFound);

    const userConfirmed = await this.confirmUser(userFound);

    return userConfirmed;
  }

  checkIsValid(userConfirmation: UserConfirmation): void {
    if (!userConfirmation) {
      throw new UserConfirmationNotFoundException({});
    }

    if (userConfirmation.isDeclined()) {
      throw new UserConfirmationMaxAttemptsException({});
    }

    if (userConfirmation.isExpired()) {
      throw new UserConfirmationExpiredException({});
    }

    if (userConfirmation.isConfirmed()) {
      throw new UserConfirmationInvalidStateException({});
    }
  }

  hasExpired(userConfirmation: UserConfirmation): boolean {
    const nowInMs = new Date().getTime();
    const hasExpired =
      userConfirmation.createdAt.getTime() + this.expirationMs <= nowInMs;

    return hasExpired;
  }

  async expire(userConfirmation: UserConfirmation): Promise<void> {
    userConfirmation.state = UserConfirmationState.EXPIRED;
    userConfirmation.expiredAt = new Date();

    await this.userConfirmationRepository.update(userConfirmation);

    throw new UserConfirmationExpiredException({
      expiredAt: userConfirmation.expiredAt,
    });
  }

  async decline(userConfirmation: UserConfirmation): Promise<void> {
    userConfirmation.state === UserConfirmationState.DECLINED;
    userConfirmation.declinedAt = new Date();

    await this.userConfirmationRepository.update(userConfirmation);

    throw new UserConfirmationMaxAttemptsException({
      attempts: userConfirmation.attempts,
    });
  }

  async confirm(userConfirmation: UserConfirmation): Promise<void> {
    userConfirmation.state === UserConfirmationState.CONFIRMED;
    userConfirmation.confirmedAt = new Date();

    await this.userConfirmationRepository.update(userConfirmation);
  }

  async confirmUser(user: User): Promise<User> {
    user.state = UserState.CONFIRMED;

    const userConfirmed = await this.userRepository.update(user);

    return userConfirmed;
  }
}
