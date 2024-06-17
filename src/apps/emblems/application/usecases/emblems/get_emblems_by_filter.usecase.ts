import { Order, Pagination, TPaginationResponse } from '@/core/domain';
import { IUseCase } from '@/core/application';
import { Emblems } from '@/emblems/domain/entities/emblems';
import {
  IEmblemsRepository,
  EmblemsFilters,
} from '@/emblems/application/repos/emblems';

type GetEmblemssPaginatedByFilterParams = {
  filters: EmblemsFilters;
  order: Order;
  pagination: Pagination;
};

export class GetEmblemssByFilterUseCase
  implements
    IUseCase<GetEmblemssPaginatedByFilterParams, TPaginationResponse<Emblems>>
{
  constructor(private readonly emblemsRepository: IEmblemsRepository) {}

  async perform(
    params: GetEmblemssPaginatedByFilterParams,
  ): Promise<TPaginationResponse<Emblems>> {
    const totalEmblems = await this.emblemsRepository.count(params.filters);

    const emblems = await this.emblemsRepository.getByFilter(
      params.filters,
      params.order,
      params.pagination,
    );

    return {
      data: emblems,
      totalItemsListed: emblems.length,
      totalItems: totalEmblems,
    };
  }
}
