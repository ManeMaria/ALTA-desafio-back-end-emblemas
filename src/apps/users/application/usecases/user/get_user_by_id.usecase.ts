import { User } from '@/users/domain';
import { IUserRepository } from '@/users/application';
import { IUseCase } from '@/core/application';

export class GetUserByIdUseCase implements IUseCase<string, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async perform(id: string): Promise<User | null> {
    const userExists = await this.userRepository.getById(id);

    if (!userExists) return null;

    return userExists;
  }
}
