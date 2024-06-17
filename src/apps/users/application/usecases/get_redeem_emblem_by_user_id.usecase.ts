import { IUseCase } from '@/core/application';
import {
  IRedeemEmblemsRepository,
  IUserRepository,
  UserNotFoundException,
} from '@/users/application';
import { Emblems } from '@/users/domain';

export class GetRedeemEmblemByUserIdUseCase
  implements IUseCase<string, Emblems[] | null>
{
  constructor(
    private readonly redeemEmblemRepository: IRedeemEmblemsRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async perform(id: string): Promise<Emblems[] | null> {
    const userExist = await this.userRepository.getById(id);

    if (!userExist)
      throw new UserNotFoundException({
        id,
      });

    const emblem = await this.redeemEmblemRepository.getByUserId(id);

    return emblem;
  }
}
