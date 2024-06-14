import {
  ConfirmUserController,
  ConfirmUserRequest,
  ConfirmUserResponse,
  TConfirmUserRequest,
} from '@/users/interface';
import {
  PrismaUserConfirmationRepository,
  PrismaUserRepository,
} from '@/users/infra';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ConfirmUserServiceConfig {
  APP_CONFIRMATION_MAX_ATTEMPTS: number;
  APP_CONFIRMATION_EXPIRATION_MS: number;
}

@Injectable()
export class ConfirmUserNestService {
  controller: ConfirmUserController;
  maxAttempts: number;
  expirationMs: number;

  constructor(
    private readonly configService: ConfigService<ConfirmUserServiceConfig>,
    userRepository: PrismaUserRepository,
    userConfirmationRepository: PrismaUserConfirmationRepository,
  ) {
    this.maxAttempts = Number(
      this.configService.get<number>('APP_CONFIRMATION_MAX_ATTEMPTS', 3),
    );

    this.expirationMs = Number(
      this.configService.get<number>(
        'APP_CONFIRMATION_EXPIRATION_MS',
        86400000, //24hrs
      ),
    );

    this.controller = new ConfirmUserController(
      userRepository,
      userConfirmationRepository,
      this.maxAttempts,
      this.expirationMs,
    );
  }

  async execute(params: TConfirmUserRequest): Promise<ConfirmUserResponse> {
    const request = new ConfirmUserRequest({
      code: params.code,
      email: params.email,
    });

    const response = await this.controller.execute(request);

    return response;
  }
}
