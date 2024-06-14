import {
  HandleUserCreatedUseCase,
  INotificationService,
  IUserConfirmationRepository,
} from '@/users/application';
import { User, UserEntity } from '@/users/domain';
import { IController } from '@/core/interface';
import { AutoValidator } from '@/libs/class-validator';
import { IsString, IsUUID, Length } from 'class-validator';

export type THandleUserCreatedRequest = Pick<User, 'id' | 'name' | 'email'>;
export type THandleUserCreatedResponse = void;

export class HandleUserCreatedRequest
  extends AutoValidator
  implements THandleUserCreatedRequest
{
  @IsUUID(4)
  id: User['id'];

  @IsString()
  @Length(1, 255)
  name: User['name'];

  @IsString()
  @Length(1, 255)
  email: User['email'];

  constructor(props: THandleUserCreatedRequest) {
    super(props);
  }
}

export class HandleUserCreatedController
  implements IController<THandleUserCreatedRequest, THandleUserCreatedResponse>
{
  private usecase: HandleUserCreatedUseCase;

  constructor(
    userConfirmationRepository: IUserConfirmationRepository,
    notificationService: INotificationService,
  ) {
    this.usecase = new HandleUserCreatedUseCase(
      userConfirmationRepository,
      notificationService,
    );
  }

  async execute(
    request: THandleUserCreatedRequest,
  ): Promise<THandleUserCreatedResponse> {
    const user = new UserEntity({
      id: request.id,
      name: request.name,
      email: request.email,
    });

    await this.usecase.perform(user);
  }
}
