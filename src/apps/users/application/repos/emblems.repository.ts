import { Emblems } from '@/users/domain';
import { IRepository } from '@/core/application';
import { DefaultFilters } from '@/core/domain';

export type EmblemsFilters = DefaultFilters &
  Partial<{
    refId: string;
    id: number;
    name: string;
    slug: string;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  }>;

export interface IEmblemsRepository
  extends IRepository<Emblems, EmblemsFilters> {
  getBySlug(name: string): Promise<Emblems>;
}
