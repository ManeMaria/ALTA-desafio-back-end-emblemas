import { Emblems, EmblemsEntity } from '@/emblems/domain/entities/emblems';
import { IEmblemsRepository } from '@/emblems/application/repos/emblems';
import { EmblemsAlreadyExistsException } from '@/emblems/application/exceptions/emblems';
import { IUseCase } from '@/core/application';

type TCreateEmblems = {
  refId?: string;
  id?: number;
  name: string;
  slug: string;
  image: string;
};

export class CreateEmblemsUseCase implements IUseCase<TCreateEmblems, Emblems> {
  constructor(private readonly emblemsRepository: IEmblemsRepository) {}

  async perform(data: TCreateEmblems): Promise<Emblems> {
    const { name, image, slug } = data;

    const emblemsExists = await this.emblemsRepository.getBySlug(slug);

    if (emblemsExists) {
      throw new EmblemsAlreadyExistsException({ name });
    }

    const emblems = new EmblemsEntity({
      name,
      image,
      slug,
    });

    const emblemsCreated = await this.emblemsRepository.save(emblems);

    return emblemsCreated;
  }
}
