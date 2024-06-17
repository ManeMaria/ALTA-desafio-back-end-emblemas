import { Emblems, EmblemsEntity } from '@/emblems/domain/entities/emblems';
import { IEmblemsRepository } from '@/emblems/application/repos/emblems';
import { EmblemsNotFoundException } from '@/emblems/application/exceptions/emblems';
import { IUseCase } from '@/core/application';

export class UpdateEmblemsUseCase implements IUseCase<Emblems, Emblems> {
  constructor(private readonly emblemsRepository: IEmblemsRepository) {}

  async perform(emblems: Emblems): Promise<Emblems> {
    const emblemsExists = await this.emblemsRepository.getById(emblems.refId);

    if (!emblemsExists) {
      throw new EmblemsNotFoundException({ refId: emblems.refId });
    }

    const emblemsToUpdate = new EmblemsEntity({
      ...emblemsExists,
      ...emblems,
    });

    const emblemsUpdated = await this.emblemsRepository.update(emblemsToUpdate);

    return emblemsUpdated;
  }
}
