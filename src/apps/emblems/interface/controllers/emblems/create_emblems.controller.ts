import { IEmblemsRepository } from '@/emblems/application/repos/emblems';
import { CreateEmblemsUseCase } from '@/emblems/application/usecases/emblems';
import { Emblems } from '@/emblems/domain/entities/emblems';
import { IController } from '@/core/interface';
import { AutoValidator, IsImagUrl } from '@/libs/class-validator';
import {
  IsDate,
  IsOptional,
  IsUUID,
  IsString,
  IsNumber,
} from 'class-validator';

export type TCreateEmblemsRequest = Omit<Emblems, 'id' | 'refId'>;
export type TCreateEmblemsResponse = Emblems;

export class CreateEmblemsRequest
  extends AutoValidator
  implements TCreateEmblemsRequest
{
  @IsString()
  name: Emblems['name'];

  @IsString()
  slug: Emblems['slug'];

  @IsImagUrl()
  image: Emblems['image'];

  constructor(props: TCreateEmblemsRequest) {
    super(props);
  }
}

export class CreateEmblemsResponse
  extends AutoValidator
  implements TCreateEmblemsResponse
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

  constructor(props: TCreateEmblemsResponse) {
    super(props);
  }
}

export class CreateEmblemsController
  implements IController<CreateEmblemsRequest, CreateEmblemsResponse>
{
  private usecase: CreateEmblemsUseCase;

  constructor(emblemsRepository: IEmblemsRepository) {
    this.usecase = new CreateEmblemsUseCase(emblemsRepository);
  }

  async execute(request: CreateEmblemsRequest): Promise<CreateEmblemsResponse> {
    const emblemsCreated = await this.usecase.perform({
      name: request.name,
      image: request.image,
      slug: request.slug,
    });

    return new CreateEmblemsResponse({
      name: emblemsCreated.name,
      id: emblemsCreated.id,
      image: emblemsCreated.image,
      slug: emblemsCreated.slug,
      refId: emblemsCreated.refId,
      createdAt: emblemsCreated.createdAt,
      updatedAt: emblemsCreated.updatedAt,
      deletedAt: emblemsCreated.deletedAt,
    });
  }
}
