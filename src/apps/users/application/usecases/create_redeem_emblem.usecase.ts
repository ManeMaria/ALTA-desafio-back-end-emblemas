import { IUseCase } from '@/core/application';
import {
  IUserRepository,
  IRedeemEmblemsRepository,
  IEmblemsRepository,
  EmblemsNotFoundException,
  UserNotFoundException,
  EmblemsAlreadyExistsException,
} from '@/users/application';

type TCreateRedeemEmblem = {
  emblemsId: string;
  userId: string;
};

export class CreateRedeemEmblemUseCase
  implements IUseCase<TCreateRedeemEmblem, void>
{
  constructor(
    private readonly redeemEmblemRepository: IRedeemEmblemsRepository,
    private readonly emblemsRepository: IEmblemsRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async perform(data: TCreateRedeemEmblem): Promise<void> {
    const { emblemsId, userId } = data;

    const redeemEmblemExists = await this.emblemsRepository.getById(emblemsId);

    if (!redeemEmblemExists) {
      throw new EmblemsNotFoundException({ refId: emblemsId });
    }

    const userExist = await this.userRepository.getById(userId);

    if (!userExist) {
      throw new UserNotFoundException({ id: userId });
    }

    const emblems = await this.redeemEmblemRepository.getByUserId(userId);

    const containsEmblem = emblems.some(({ refId }) => refId === emblemsId);

    if (containsEmblem) {
      throw new EmblemsAlreadyExistsException({ refId: emblemsId });
    }

    await this.redeemEmblemRepository.save({
      emblemsId,
      userId,
    });
  }
}
