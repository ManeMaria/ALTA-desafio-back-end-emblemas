import {
  ConfirmUserUseCase,
  IUserConfirmationRepository,
  IUserRepository,
} from '@/users/application';
import { User, UserConfirmation, UserState } from '@/users/domain';
import { IController } from '@/core/interface';
import { AutoValidator } from '@/libs/class-validator';
import { IsEmail, IsEnum, IsString, IsUUID, Length } from 'class-validator';

export type TConfirmUserRequest = Pick<UserConfirmation, 'code' | 'email'>;
export type TConfirmUserResponse = Pick<
  User,
  'id' | 'name' | 'email' | 'state'
>;

export class ConfirmUserRequest
  extends AutoValidator
  implements TConfirmUserRequest
{
  @IsString()
  @Length(5)
  code: UserConfirmation['code'];

  @IsEmail()
  email: UserConfirmation['email'];

  constructor(props: TConfirmUserRequest) {
    super(props);
  }
}

export class ConfirmUserResponse
  extends AutoValidator
  implements TConfirmUserResponse
{
  @IsUUID(4)
  id: User['id'];

  @IsEnum(UserState)
  state: User['state'];

  @IsString()
  @Length(1, 255)
  name: User['name'];

  @IsEmail()
  email: User['email'];

  constructor(props: TConfirmUserResponse) {
    super(props);
  }
}

export class ConfirmUserController
  implements IController<ConfirmUserRequest, ConfirmUserResponse>
{
  private usecase: ConfirmUserUseCase;

  constructor(
    userRepository: IUserRepository,
    userConfirmationRepository: IUserConfirmationRepository,
    maxAttempts: number,
    expirationMs: number,
  ) {
    this.usecase = new ConfirmUserUseCase(
      userRepository,
      userConfirmationRepository,
      maxAttempts,
      expirationMs,
    );
  }

  async execute(request: ConfirmUserRequest): Promise<ConfirmUserResponse> {
    const userConfirmed = await this.usecase.perform({
      email: request.email,
      code: request.code,
    });

    return new ConfirmUserResponse({
      id: userConfirmed.id,
      state: userConfirmed.state,
      name: userConfirmed.name,
      email: userConfirmed.email,
    });
  }
}
