import { IRepository } from '@/core/application';
import { Emblems } from '@/users/domain';

export type RedeemEmblemsRepository = {
  emblemsId: string;
  userId: string;
};

export type RedeemEmblemsFilters = {
  slug?: string;
  emblemsId?: string;
  userId?: string;
};

export type IRedeemEmblemsRepository = Pick<
  IRepository<RedeemEmblemsRepository, RedeemEmblemsFilters>,
  'save'
> & {
  getByUserId(id: string): Promise<Emblems[] | null>;
};
