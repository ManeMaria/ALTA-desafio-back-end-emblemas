import { Emblems } from '@/emblems/domain/entities/emblems';
import { IEmblemsRepository } from '@/emblems/application/repos/emblems';
import { IUseCase } from '@/core/application';

export class GetEmblemsByIdUseCase implements IUseCase<string, Emblems> {
  constructor(private readonly emblemsRepository: IEmblemsRepository) {}

  async perform(id: string): Promise<Emblems | null> {
    const emblemsExists = await this.emblemsRepository.getById(id);

    if (!emblemsExists) return null;

    return emblemsExists;
  }
}
