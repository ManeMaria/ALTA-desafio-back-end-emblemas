import { DeleteUserByIdUseCase, IUserRepository } from '@/users/application';
import { IController } from '@/core/interface';
import { User } from '@/users/domain';
import { AutoValidator } from '@/libs/class-validator';
import { IsUUID } from 'class-validator';

export type TDeleteUserByIdRequest = Pick<User, 'id'>;

export class DeleteUserByIdRequest
  extends AutoValidator
  implements TDeleteUserByIdRequest
{
  @IsUUID(4)
  id: string;

  constructor(props: TDeleteUserByIdRequest) {
    super(props);
  }
}

export type IDeleteUserByIdResponse = void;

export class DeleteUserByIdController
  implements IController<TDeleteUserByIdRequest, IDeleteUserByIdResponse>
{
  private usecase: DeleteUserByIdUseCase;

  constructor(userRepository: IUserRepository) {
    this.usecase = new DeleteUserByIdUseCase(userRepository);
  }

  async execute(
    request: TDeleteUserByIdRequest,
  ): Promise<IDeleteUserByIdResponse> {
    await this.usecase.perform(request.id);
  }
}
