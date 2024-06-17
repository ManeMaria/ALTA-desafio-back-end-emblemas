import { User } from '@/users/domain';
import { IUserRepository } from '@/users/application';
import { IUseCase } from '@/core/application';

export class GetUserByEmailUseCase implements IUseCase<User['email'], User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async perform(email: User['email']): Promise<User> {
    const userFound = await this.userRepository.getByEmail(email);

    return userFound;
  }
}
