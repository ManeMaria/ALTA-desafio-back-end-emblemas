import { GetUserByIdUseCase, IUserRepository } from '@/users/application';
import { IController } from '@/core/interface';
import { User, UserState } from '@/users/domain';
import { AutoValidator } from '@/libs/class-validator';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export type TGetUserByIdRequest = Pick<User, 'id'>;
export type TGetUserByIdResponse = Omit<User, 'password' | 'isConfirmed'>;

export class GetUserByIdRequest
  extends AutoValidator
  implements TGetUserByIdRequest
{
  @IsUUID(4)
  id: string;

  constructor(props: TGetUserByIdRequest) {
    super(props);
  }
}

export class GetUserByIdResponse
  extends AutoValidator
  implements TGetUserByIdResponse
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

  constructor(props: TGetUserByIdResponse) {
    super(props);
  }
}

export class GetUserByIdController
  implements IController<TGetUserByIdRequest, TGetUserByIdResponse>
{
  private usecase: GetUserByIdUseCase;

  constructor(userRepository: IUserRepository) {
    this.usecase = new GetUserByIdUseCase(userRepository);
  }

  async execute(request: TGetUserByIdRequest): Promise<TGetUserByIdResponse> {
    const user = await this.usecase.perform(request.id);

    const response = user && new GetUserByIdResponse(user);

    return response;
  }
}
