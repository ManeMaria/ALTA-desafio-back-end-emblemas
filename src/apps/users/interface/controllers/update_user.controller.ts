import { User, UserEntity, UserState } from '@/users/domain';
import { IUserRepository, UpdateUserUseCase } from '@/users/application';
import { IController } from '@/core/interface';
import { AutoValidator } from '@/libs/class-validator';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export interface TUpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
}
export type TUpdateUserResponse = Omit<
  User,
  'password' | 'isConfirmed' | 'roles'
>;

export class UpdateUserRequest
  extends AutoValidator
  implements TUpdateUserRequest
{
  @IsUUID(4)
  id: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 255)
  email: string;

  constructor(props: TUpdateUserRequest) {
    super(props);
  }
}

export class UpdateUserResponse
  extends AutoValidator
  implements TUpdateUserResponse
{
  @IsUUID(4)
  id: string;

  @IsEnum(UserState)
  state: UserState;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 255)
  email: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;

  constructor(props: TUpdateUserResponse) {
    super(props);
  }
}

export class UpdateUserByIdController
  implements IController<TUpdateUserRequest, TUpdateUserResponse>
{
  private usecase: UpdateUserUseCase;

  constructor(userRepository: IUserRepository) {
    this.usecase = new UpdateUserUseCase(userRepository);
  }

  async execute(request: TUpdateUserRequest): Promise<TUpdateUserResponse> {
    const userToUpdate = new UserEntity({
      id: request.id,
      name: request.name,
      email: request.email,
    });

    const userUpdated = await this.usecase.perform(userToUpdate);

    return new UpdateUserResponse(userUpdated);
  }
}
