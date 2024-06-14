import { GetUserByEmailUseCase, IUserRepository } from '@/users/application';
import { IController } from '@/core/interface';
import { User, UserState } from '@/users/domain';
import { AutoValidator } from '@/libs/class-validator';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export type TGetUserByEmailRequest = Pick<User, 'email'>;
export type TGetUserByEmailResponse = Omit<User, 'isConfirmed'>;

export class GetUserByEmailRequest
  extends AutoValidator
  implements TGetUserByEmailRequest
{
  @IsEmail()
  email: User['email'];

  constructor(props: TGetUserByEmailRequest) {
    super(props);
  }
}

export class GetUserByEmailResponse
  extends AutoValidator
  implements TGetUserByEmailResponse
{
  @IsUUID(4)
  id: User['id'];

  @IsInt()
  @Min(1)
  serial: User['serial'];

  @IsEnum(UserState)
  state: User['state'];

  @IsString()
  @Length(1, 255)
  name: User['name'];

  @IsEmail()
  email: User['email'];

  @IsString()
  @Length(8)
  password: User['password'];

  @IsOptional()
  @IsDate()
  createdAt: User['createdAt'];

  @IsOptional()
  @IsDate()
  updatedAt: User['updatedAt'];

  constructor(props: TGetUserByEmailResponse) {
    super(props);
  }
}

export class GetUserByEmailController
  implements IController<GetUserByEmailRequest, GetUserByEmailResponse>
{
  private usecase: GetUserByEmailUseCase;

  constructor(userRepository: IUserRepository) {
    this.usecase = new GetUserByEmailUseCase(userRepository);
  }

  async execute(
    request: GetUserByEmailRequest,
  ): Promise<GetUserByEmailResponse> {
    const user = await this.usecase.perform(request.email);

    const response =
      user &&
      new GetUserByEmailResponse({
        id: user.id,
        serial: user.serial,
        state: user.state,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    return response;
  }
}
