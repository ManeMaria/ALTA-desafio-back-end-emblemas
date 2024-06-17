import {
  IsDate,
  IsOptional,
  IsUUID,
  IsNumber,
  IsString,
} from 'class-validator';
import { Emblems } from '@/emblems/domain/entities/emblems';
import { GetEmblemssByFilterUseCase } from '@/emblems/application/usecases/emblems';
import {
  IEmblemsRepository,
  EmblemsFilters,
} from '@/emblems/application/repos/emblems';
import {
  DefaultFiltersRequest,
  Order,
  OrderEntity,
  Pagination,
  PaginationEntity,
  PaginationResponse,
  TPaginationResponse,
} from '@/core/domain';
import { IController } from '@/core/interface';
import { AutoValidator, IsImagUrl } from '@/libs/class-validator';

export type TGetEmblemssByFilterRequest = EmblemsFilters & Pagination & Order;
export type TGetEmblemsByFilterResponseItem = Emblems;
export type TGetEmblemssByFilterResponse =
  TPaginationResponse<TGetEmblemsByFilterResponseItem>;

export class GetEmblemssByFilterRequest
  extends DefaultFiltersRequest
  implements TGetEmblemssByFilterRequest
{
  @IsOptional()
  @IsNumber()
  id: Emblems['id'];

  @IsOptional()
  @IsString()
  name: Emblems['name'];

  @IsOptional()
  @IsString()
  slug: Emblems['slug'];

  constructor(props: TGetEmblemssByFilterRequest) {
    super(props);
  }
}

export class GetEmblemsByFilterResponseItem
  extends AutoValidator
  implements TGetEmblemsByFilterResponseItem
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

  constructor(props: TGetEmblemsByFilterResponseItem) {
    super(props);
  }
}

export class GetEmblemssByFilterResponse extends PaginationResponse<TGetEmblemsByFilterResponseItem> {}

export class GetEmblemssByFilterController
  implements
    IController<TGetEmblemssByFilterRequest, TGetEmblemssByFilterResponse>
{
  private usecase: GetEmblemssByFilterUseCase;

  constructor(emblemsRepository: IEmblemsRepository) {
    this.usecase = new GetEmblemssByFilterUseCase(emblemsRepository);
  }

  async execute(
    request: TGetEmblemssByFilterRequest,
  ): Promise<TGetEmblemssByFilterResponse> {
    const pagination = new PaginationEntity({
      ...(request.take && { take: request.take }),
      ...(request.skip && { skip: request.skip }),
    });

    const order = new OrderEntity({
      ...(request.mode && { mode: request.mode }),
      ...(request.property && { property: request.property }),
    });

    const filters = request;

    const emblemssPaginated = await this.usecase.perform({
      filters,
      order,
      pagination,
    });

    return new GetEmblemssByFilterResponse({
      data: emblemssPaginated.data.map((emblems) => emblems),
      totalItems: emblemssPaginated.totalItems,
      totalItemsListed: emblemssPaginated.totalItemsListed,
    });
  }
}
