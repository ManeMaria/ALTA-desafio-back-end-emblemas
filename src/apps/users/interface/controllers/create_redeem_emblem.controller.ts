import {
  CreateRedeemEmblemUseCase,
  IEmblemsRepository,
  IRedeemEmblemsRepository,
  IUserRepository,
} from '@/users/application';
import { IController } from '@/core/interface';
import { AutoValidator } from '@/libs/class-validator';
import { IsUUID } from 'class-validator';

export type TCreateRedeemEmblemRequest = {
  userId: string;
  emblemsId: string;
};
export type TCreateRedeemEmblemResponse = void;

export class CreateRedeemEmblemRequest
  extends AutoValidator
  implements TCreateRedeemEmblemRequest
{
  @IsUUID(4)
  userId: string;

  @IsUUID(4)
  emblemsId: string;

  constructor(props: TCreateRedeemEmblemRequest) {
    super(props);
  }
}

export class CreateRedeemEmblemController
  implements IController<CreateRedeemEmblemRequest, void>
{
  private usecase: CreateRedeemEmblemUseCase;

  constructor(
    redeemEmblemRepository: IRedeemEmblemsRepository,
    emblemsRepository: IEmblemsRepository,
    userRepository: IUserRepository,
  ) {
    this.usecase = new CreateRedeemEmblemUseCase(
      redeemEmblemRepository,
      emblemsRepository,
      userRepository,
    );
  }

  async execute(request: CreateRedeemEmblemRequest): Promise<void> {
    await this.usecase.perform({
      emblemsId: request.emblemsId,
      userId: request.userId,
    });
  }
}
