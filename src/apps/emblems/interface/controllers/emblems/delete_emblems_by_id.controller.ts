import { IEmblemsRepository } from '@/emblems/application/repos/emblems';
import { DeleteEmblemsByIdUseCase } from '@/emblems/application/usecases/emblems';
import { IController } from '@/core/interface';
import { Emblems } from '@/emblems/domain/entities/emblems';
import { AutoValidator } from '@/libs/class-validator';
import { IsUUID } from 'class-validator';

export type TDeleteEmblemsByIdRequest = Pick<Emblems, 'refId'>;

export class DeleteEmblemsByIdRequest
  extends AutoValidator
  implements TDeleteEmblemsByIdRequest
{
  @IsUUID(4)
  refId: string;

  constructor(props: TDeleteEmblemsByIdRequest) {
    super(props);
  }
}

export type TDeleteEmblemsByIdResponse = void;

export class DeleteEmblemsByIdController
  implements IController<TDeleteEmblemsByIdRequest, TDeleteEmblemsByIdResponse>
{
  private usecase: DeleteEmblemsByIdUseCase;

  constructor(emblemsRepository: IEmblemsRepository) {
    this.usecase = new DeleteEmblemsByIdUseCase(emblemsRepository);
  }

  async execute(
    request: TDeleteEmblemsByIdRequest,
  ): Promise<TDeleteEmblemsByIdResponse> {
    await this.usecase.perform(request.refId);
  }
}
