import {
  UpdateUserForgotPasswordController,
  UpdateUserForgotPasswordRequest,
  TUpdateUserForgotPasswordRequest,
  UpdateUserForgotPasswordResponse,
} from '@/users/interface';
import {
  PrismaUserForgotPasswordRepository,
  PrismaUserRepository,
} from '@/users/infra';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface UpdateUserForgotPasswordServiceConfig {
  APP_FORGOT_PASSWORD_MAX_ATTEMPTS: number;
  APP_FORGOT_PASSWORD_EXPIRATION_MS: number;
}

@Injectable()
export class UpdateUserForgotPasswordNestService {
  controller: UpdateUserForgotPasswordController;
  maxAttempts: number;
  expirationMs: number;

  constructor(
    private readonly configService: ConfigService<UpdateUserForgotPasswordServiceConfig>,
    userRepository: PrismaUserRepository,
    userForgotPasswordRepository: PrismaUserForgotPasswordRepository,
  ) {
    this.maxAttempts = Number(
      this.configService.get<number>('APP_FORGOT_PASSWORD_MAX_ATTEMPTS', 3),
    );

    this.expirationMs = Number(
      this.configService.get<number>(
        'APP_FORGOT_PASSWORD_EXPIRATION_MS',
        900000, // 15 minutes
      ),
    );

    this.controller = new UpdateUserForgotPasswordController(
      userRepository,
      userForgotPasswordRepository,
      this.maxAttempts,
      this.expirationMs,
    );
  }

  async execute(
    params: TUpdateUserForgotPasswordRequest,
  ): Promise<UpdateUserForgotPasswordResponse> {
    const request = new UpdateUserForgotPasswordRequest({
      id: params.id,
      code: params.code,
      newPassword: params.newPassword,
    });

    const response = await this.controller.execute(request);

    return response;
  }
}
