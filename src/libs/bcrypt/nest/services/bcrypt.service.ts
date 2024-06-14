import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BcryptConfig } from '@/libs/bcrypt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private saltRounds: number;
  private DEFAULT_SALT_ROUNDS = 10;

  constructor(private readonly configService: ConfigService<BcryptConfig>) {
    this.saltRounds = Number(
      this.configService.get<number>(
        'APP_SALT_ROUNDS',
        this.DEFAULT_SALT_ROUNDS,
      ),
    );
  }

  hashSync(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  compareHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
