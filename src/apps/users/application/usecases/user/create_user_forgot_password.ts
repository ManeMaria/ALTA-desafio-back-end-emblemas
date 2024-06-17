import {
  IEmailRepository,
  INotificationService,
  IUserForgotPasswordRepository,
  IUserRepository,
  UserInvalidStateException,
  UserNotFoundException,
} from '@/users/application';
import { IUseCase } from '@/core/application';
import {
  EmailEntity,
  User,
  UserForgotPassword,
  UserForgotPasswordEntity,
  UserForgotPasswordState,
  UserState,
} from '@/users/domain';
import { RandomCode } from '@/core/domain';
import { TUserEvent } from '@/apps/users/events';
import { EmailState } from '@/apps/users/domain';

export type TCreateUserForgotPassword = { email: User['email'] };

export class CreateUserForgotPasswordUseCase
  implements IUseCase<TUserEvent, UserForgotPassword>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userForgotPasswordRepository: IUserForgotPasswordRepository,
    private readonly notificationService: INotificationService,
    private readonly emailRepository: IEmailRepository,
  ) {}

  async perform(data: TCreateUserForgotPassword): Promise<UserForgotPassword> {
    const { email } = data;

    const userFound = await this.userRepository.getByEmail(data.email);

    if (!userFound) {
      throw new UserNotFoundException({ email });
    }

    if (userFound.state !== UserState.CONFIRMED) {
      throw new UserInvalidStateException(userFound);
    }

    const userAlreadyForgotPassword =
      await this.userForgotPasswordRepository.getByUserAndIsPending(userFound);

    if (userAlreadyForgotPassword) {
      userAlreadyForgotPassword.state = UserForgotPasswordState.DECLINED;
      userAlreadyForgotPassword.declinedAt = new Date();

      await this.userForgotPasswordRepository.update(userAlreadyForgotPassword);
    }

    const code = this.generateRandomCode();

    const userForgotPassword = new UserForgotPasswordEntity({
      state: UserForgotPasswordState.PENDING,
      attempts: 0,
      code,
      email: userFound.email,
      user: userFound,
    });

    const userForgotPasswordCreated =
      await this.userForgotPasswordRepository.save(userForgotPassword);

    await this.sendEmailUser(userForgotPassword);

    return userForgotPasswordCreated;
  }

  generateRandomCode(): string {
    return RandomCode.generate(5);
  }

  async sendEmailUser(user: UserForgotPassword) {
    const paramsEmail: EmailEntity = {
      to: user.email,
      from: '<noreply@example.com>',
      title: 'Confirm your email',
      state: EmailState.PENDING,
      html: `<p>Hey ${user.user.name},</p>
      <p>Please click below to confirm your email</p>
      <p>
      <a href="{{ https://front-end-server/route/${user.code} }}">Confirm</a>
      </p>

      <p>If you did not request this email you can safely ignore it.</p>`,
      id: user.id,
      user: user.user,
    };

    await this.notificationService.sendConfirmationEmail(paramsEmail);

    const emailToCreate = new EmailEntity(paramsEmail);

    await this.emailRepository.save(emailToCreate);
  }
}
