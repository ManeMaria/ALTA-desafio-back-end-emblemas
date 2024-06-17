import {
  GetRedeemEmblemByUserIdUseCase,
  IRedeemEmblemsRepository,
  IUserRepository,
} from '@/users/application';
import { IController } from '@/core/interface';
import { AutoValidator, IsImagUrl } from '@/libs/class-validator';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Emblems } from '@/users/domain';

export type TGetRedeemEmblemByUserIdRequest = {
  userId: string;
};
export type TGetRedeemEmblemByUserIdResponseItem = Emblems;
export type TGetRedeemEmblemByUserIdResponse = Emblems[];

export class GetRedeemEmblemByUserIdRequest
  extends AutoValidator
  implements TGetRedeemEmblemByUserIdRequest
{
  @IsUUID(4)
  userId: string;

  constructor(props: TGetRedeemEmblemByUserIdRequest) {
    super(props);
  }
}

export class GetRedeemEmblemByUserIdItem
  extends AutoValidator
  implements TGetRedeemEmblemByUserIdResponseItem
{
  @IsUUID(4)
  refId: Emblems['refId'];

  @IsNumber()
  id: Emblems['id'];

  @IsString()
  name: Emblems['name'];

  @IsString()
  slug: Emblems['slug'];

  @IsImagUrl()
  image: Emblems['image'];

  @IsOptional()
  @IsDate()
  createdAt: Emblems['createdAt'];

  @IsOptional()
  @IsDate()
  updatedAt: Emblems['updatedAt'];

  @IsOptional()
  @IsDate()
  deletedAt: Emblems['deletedAt'];

  constructor(props: TGetRedeemEmblemByUserIdResponseItem) {
    super(props);
  }
}

export class GetRedeemEmblemByUserIdController
  implements IController<GetRedeemEmblemByUserIdRequest, Emblems[] | null>
{
  private usecase: GetRedeemEmblemByUserIdUseCase;

  constructor(
    redeemEmblemRepository: IRedeemEmblemsRepository,
    userRepository: IUserRepository,
  ) {
    this.usecase = new GetRedeemEmblemByUserIdUseCase(
      redeemEmblemRepository,
      userRepository,
    );
  }

  async execute(
    request: GetRedeemEmblemByUserIdRequest,
  ): Promise<Emblems[] | null> {
    const response = await this.usecase.perform(request.userId);

    return response.map((emblem) => new GetRedeemEmblemByUserIdItem(emblem));
  }
}
