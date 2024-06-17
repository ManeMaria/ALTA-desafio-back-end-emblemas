import {
  UpdateUserForgotPasswordUseCase,
  IUserForgotPasswordRepository,
  IUserRepository,
} from '@/users/application';
import {
  User,
  UserForgotPassword,
  UserForgotPasswordState,
} from '@/users/domain';
import { IController } from '@/core/interface';
import { AutoValidator } from '@/libs/class-validator';
import { IsEmail, IsEnum, IsString, IsUUID, Length } from 'class-validator';

export type TUpdateUserForgotPasswordRequest = {
  id: UserForgotPassword['id'];
  code: UserForgotPassword['code'];
  newPassword: User['password'];
};

export type TUpdateUserForgotPasswordResponse = Pick<
  UserForgotPassword,
  'id' | 'state'
> & { userId: User['id']; userEmail: User['email'] };

export class UpdateUserForgotPasswordRequest
  extends AutoValidator
  implements TUpdateUserForgotPasswordRequest
{
  @IsUUID()
  id: string;

  @IsString()
  @Length(5)
  code: string;

  @IsString()
  @Length(8, 255)
  newPassword: string;

  constructor(props: TUpdateUserForgotPasswordRequest) {
    super(props);
  }
}

export class UpdateUserForgotPasswordResponse
  extends AutoValidator
  implements TUpdateUserForgotPasswordResponse
{
  @IsUUID(4)
  id: string;

  @IsEnum(UserForgotPasswordState)
  state: UserForgotPasswordState;

  @IsUUID(4)
  userId: string;

  @IsEmail()
  userEmail: string;

  constructor(props: TUpdateUserForgotPasswordResponse) {
    super(props);
  }
}

export class UpdateUserForgotPasswordController
  implements
    IController<
      UpdateUserForgotPasswordRequest,
      UpdateUserForgotPasswordResponse
    >
{
  private usecase: UpdateUserForgotPasswordUseCase;

  constructor(
    userRepository: IUserRepository,
    userForgotPasswordRepository: IUserForgotPasswordRepository,
    maxAttempts: number,
    expirationMs: number,
  ) {
    this.usecase = new UpdateUserForgotPasswordUseCase(
      userRepository,
      userForgotPasswordRepository,
      maxAttempts,
      expirationMs,
    );
  }

  async execute(
    request: UpdateUserForgotPasswordRequest,
  ): Promise<UpdateUserForgotPasswordResponse> {
    const userForgotPassoword = await this.usecase.perform({
      id: request.id,
      code: request.code,
      newPassword: request.newPassword,
    });

    return new UpdateUserForgotPasswordResponse({
      id: userForgotPassoword.id,
      state: userForgotPassoword.state,
      userId: userForgotPassoword.user.id,
      userEmail: userForgotPassoword.user.email,
    });
  }
}
