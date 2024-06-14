import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '@/api-users/domain';
import { GetUserByEmailNestService } from '@/users/infra';
import { UserState } from '@/apps/users/domain';
import { BcryptService } from '@/libs/bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly getUserByEmailService: GetUserByEmailNestService,
    private readonly hashService: BcryptService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<AuthUser> {
    const user = await this.getUserByEmailService.execute({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const invalidState = user.state !== UserState.CONFIRMED;
    const wrongPassword = !this.hashService.compareHash(
      password,
      user.password,
    );

    if (invalidState || wrongPassword) {
      throw new UnauthorizedException();
    }

    const authUser: AuthUser = {
      id: user.id,
      serial: user.serial,
      state: user.state,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return authUser;
  }
}
