import { CreateUserUseCase, IUserRepository } from '@/users/application';
import { User, UserState } from '@/users/domain';
import { IController } from '@/core/interface';
import { AutoValidator } from '@/libs/class-validator';
import { IsEmail, IsEnum, IsString, IsUUID, Length } from 'class-validator';

export type TCreateUserRequest = Pick<User, 'name' | 'email' | 'password'>;
export type TCreateUserResponse = Pick<
  User,
  'id' | 'name' | 'email' | 'state' | 'createdAt'
>;

export class CreateUserRequest
  extends AutoValidator
  implements TCreateUserRequest
{
  @IsString()
  @Length(1, 255)
  name: User['name'];

  @IsEmail()
  email: User['email'];

  @IsString()
  @Length(8)
  password: User['password'];

  constructor(props: TCreateUserRequest) {
    super(props);
  }
}

export class CreateUserResponse
  extends AutoValidator
  implements TCreateUserResponse
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

  constructor(props: TCreateUserResponse) {
    super(props);
  }
}

export class CreateUserController
  implements IController<CreateUserRequest, CreateUserResponse>
{
  private usecase: CreateUserUseCase;

  constructor(userRepository: IUserRepository) {
    this.usecase = new CreateUserUseCase(userRepository);
  }

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const userCreated = await this.usecase.perform({
      name: request.name,
      email: request.email,
      password: request.password,
    });

    return new CreateUserResponse({
      id: userCreated.id,
      state: userCreated.state,
      name: userCreated.name,
      email: userCreated.email,
    });
  }
}
