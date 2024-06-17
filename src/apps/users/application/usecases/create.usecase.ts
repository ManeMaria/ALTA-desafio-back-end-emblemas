import {
  EmailEntity,
  User,
  UserConfirmationEntity,
  UserConfirmationState,
  UserEntity,
  UserState,
} from '@/users/domain';
import {
  IEmailRepository,
  INotificationService,
  IUserConfirmationRepository,
  IUserRepository,
  UserAlreadyExistsException,
} from '@/users/application';
import { IUseCase } from '@/core/application';
import { RandomCode } from '@/core/domain';
import { EmailState } from '@/apps/users/domain';

type TCreateUser = { name: string; email: string; password: string };

export class CreateUserUseCase implements IUseCase<TCreateUser, User> {
  constructor(
    private readonly userConfirmationRepository: IUserConfirmationRepository,
    private readonly userRepository: IUserRepository,
    private readonly notificationService: INotificationService,
    private readonly emailRepository: IEmailRepository,
  ) {}

  async perform(data: TCreateUser): Promise<User> {
    const { name, email, password } = data;

    const userExists = await this.userRepository.getByEmail(email);

    if (userExists && userExists.isConfirmed()) {
      throw new UserAlreadyExistsException({ name, email });
    }

    if (userExists) {
      return userExists;
    }

    const user = new UserEntity({
      name,
      email,
      state: UserState.PENDING_CONFIRMATION,
      password,
    });

    const userCreated = await this.userRepository.save(user);

    await this.sendEmailUser(user);

    return userCreated;
  }

  generateRandomCode(): string {
    return RandomCode.generate(5);
  }

  async sendEmailUser(user: User) {
    const code = this.generateRandomCode();

    const userConfirmation = new UserConfirmationEntity({
      state: UserConfirmationState.PENDING,
      attempts: 0,
      code,
      email: user.email,
      user: new UserEntity({ id: user.id }),
    });

    const paramsEmail: EmailEntity = {
      to: user.email,
      from: '<noreply@example.com>',
      title: 'Confirm your email',
      state: EmailState.PENDING,
      html: `<p>Hey ${user.name},</p>
      <p>Please click below to confirm your email</p>
      <p>
      <a href="{{ https://front-end-server/route/${code} }}">Confirm</a>
      </p>

      <p>If you did not request this email you can safely ignore it.</p>`,
      id: userConfirmation.id,
      user,
    };

    await this.notificationService.sendConfirmationEmail(paramsEmail);

    const email = new EmailEntity(paramsEmail);

    await this.userConfirmationRepository.save(userConfirmation);

    await this.emailRepository.save(email);
  }
}
