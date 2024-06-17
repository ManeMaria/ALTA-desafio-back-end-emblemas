import { Emblems } from '@/emblems/domain/entities/emblems';
import { DefaultFilters } from '@/core/domain';
import { IRepository } from '@/core/application';

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
  getBySlug(slug: string): Promise<Emblems>;
}
