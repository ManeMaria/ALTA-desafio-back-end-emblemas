import { GetEmblemsByIdUseCase } from '@/emblems/application/usecases/emblems';
import { IEmblemsRepository } from '@/emblems/application/repos/emblems';
import { IController } from '@/core/interface';
import { Emblems } from '@/emblems/domain/entities/emblems';
import { AutoValidator, IsImagUrl } from '@/libs/class-validator';
import {
  IsDate,
  IsOptional,
  IsUUID,
  IsNumber,
  IsString,
} from 'class-validator';

export type TGetEmblemsByIdRequest = Pick<Emblems, 'refId'>;
export type TGetEmblemsByIdResponse = Emblems;

export class GetEmblemsByIdRequest
  extends AutoValidator
  implements TGetEmblemsByIdRequest
{
  @IsUUID(4)
  refId: string;

  constructor(props: TGetEmblemsByIdRequest) {
    super(props);
  }
}

export class GetEmblemsByIdResponse
  extends AutoValidator
  implements TGetEmblemsByIdResponse
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

  constructor(props: TGetEmblemsByIdResponse) {
    super(props);
  }
}

export class GetEmblemsByIdController
  implements IController<TGetEmblemsByIdRequest, GetEmblemsByIdResponse>
{
  private usecase: GetEmblemsByIdUseCase;

  constructor(emblemsRepository: IEmblemsRepository) {
    this.usecase = new GetEmblemsByIdUseCase(emblemsRepository);
  }

  async execute(
    request: TGetEmblemsByIdRequest,
  ): Promise<GetEmblemsByIdResponse> {
    const emblems = await this.usecase.perform(request.refId);

    const response =
      emblems &&
      new GetEmblemsByIdResponse({
        name: emblems.name,
        id: emblems.id,
        image: emblems.image,
        slug: emblems.slug,
        refId: emblems.refId,
        createdAt: emblems.createdAt,
        updatedAt: emblems.updatedAt,
        deletedAt: emblems.deletedAt,
      });

    return response;
  }
}
