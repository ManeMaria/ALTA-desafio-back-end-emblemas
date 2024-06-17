import { Emblems, EmblemsEntity } from '@/emblems/domain/entities/emblems';
import { IEmblemsRepository } from '@/emblems/application/repos/emblems';
import { UpdateEmblemsUseCase } from '@/emblems/application/usecases/emblems';
import { IController } from '@/core/interface';
import { AutoValidator, IsImagUrl } from '@/libs/class-validator';
import {
  IsDate,
  IsOptional,
  IsUUID,
  IsNumber,
  IsString,
} from 'class-validator';

export interface TUpdateEmblemsRequest {
  refId: string;
  name?: string;
  slug?: string;
}
export type TUpdateEmblemsResponse = Emblems;

export class UpdateEmblemsRequest
  extends AutoValidator
  implements TUpdateEmblemsRequest
{
  @IsUUID(4)
  refId: string;

  @IsOptional()
  @IsString()
  name: Emblems['name'];

  @IsOptional()
  @IsString()
  slug: Emblems['slug'];

  constructor(props: TUpdateEmblemsRequest) {
    super(props);
  }
}

export class UpdateEmblemsResponse
  extends AutoValidator
  implements TUpdateEmblemsResponse
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

  constructor(props: TUpdateEmblemsResponse) {
    super(props);
  }
}

export class UpdateEmblemsController
  implements IController<TUpdateEmblemsRequest, UpdateEmblemsResponse>
{
  private usecase: UpdateEmblemsUseCase;

  constructor(emblemsRepository: IEmblemsRepository) {
    this.usecase = new UpdateEmblemsUseCase(emblemsRepository);
  }

  async execute(
    request: TUpdateEmblemsRequest,
  ): Promise<UpdateEmblemsResponse> {
    const emblemsToUpdate = new EmblemsEntity({
      refId: request.refId,
      name: request.name,
      slug: request.slug,
    });

    const emblemsUpdated = await this.usecase.perform(emblemsToUpdate);

    return new UpdateEmblemsResponse({
      name: emblemsUpdated.name,
      id: emblemsUpdated.id,
      image: emblemsUpdated.image,
      slug: emblemsUpdated.slug,
      refId: emblemsUpdated.refId,
      createdAt: emblemsUpdated.createdAt,
      updatedAt: emblemsUpdated.updatedAt,
      deletedAt: emblemsUpdated.deletedAt,
    });
  }
}
