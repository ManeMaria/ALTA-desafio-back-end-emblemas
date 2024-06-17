import { IUseCase } from '@/core/application';
import { IEmblemsRepository } from '@/emblems/application/repos/emblems';
import { EmblemsNotFoundException } from '@/emblems/application/exceptions/emblems';

export class DeleteEmblemsByIdUseCase implements IUseCase<string, void> {
  constructor(private readonly emblemsRepository: IEmblemsRepository) {}

  async perform(refId: string): Promise<void> {
    const emblemsExists = await this.emblemsRepository.getById(refId);

    if (!emblemsExists) {
      throw new EmblemsNotFoundException({ refId });
    }

    await this.emblemsRepository.deleteById(refId);
  }
}
