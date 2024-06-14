import {
  CreateUserForgotPasswordUseCase,
  INotificationService,
  IUserForgotPasswordRepository,
  IUserRepository,
} from '@/users/application';
import { User, UserForgotPassword } from '@/users/domain';
import { IController } from '@/core/interface';
import { AutoValidator } from '@/libs/class-validator';
import { IsEmail, IsUUID } from 'class-validator';

export type TCreateUserForgotPasswordRequest = Pick<User, 'email'>;
export type TCreateUserForgotPasswordResponse = Pick<UserForgotPassword, 'id'>;

export class CreateUserForgotPasswordRequest
  extends AutoValidator
  implements TCreateUserForgotPasswordRequest
{
  @IsEmail()
  email: string;

  constructor(props: TCreateUserForgotPasswordRequest) {
    super(props);
  }
}

export class CreateUserForgotPasswordResponse
  extends AutoValidator
  implements TCreateUserForgotPasswordResponse
{
  @IsUUID(4)
  id: string;

  constructor(props: TCreateUserForgotPasswordResponse) {
    super(props);
  }
}

export class CreateUserForgotPasswordController
  implements
    IController<
      CreateUserForgotPasswordRequest,
      CreateUserForgotPasswordResponse
    >
{
  private usecase: CreateUserForgotPasswordUseCase;

  constructor(
    userRepository: IUserRepository,
    userForgotPasswordRepository: IUserForgotPasswordRepository,
    notificationService: INotificationService,
  ) {
    this.usecase = new CreateUserForgotPasswordUseCase(
      userRepository,
      userForgotPasswordRepository,
      notificationService,
    );
  }

  async execute(
    request: CreateUserForgotPasswordRequest,
  ): Promise<CreateUserForgotPasswordResponse> {
    const userForgotPassword = await this.usecase.perform({
      email: request.email,
    });

    return new CreateUserForgotPasswordResponse({
      id: userForgotPassword.id,
    });
  }
}
