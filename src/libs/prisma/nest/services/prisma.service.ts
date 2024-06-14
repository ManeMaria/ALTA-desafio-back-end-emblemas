import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaConfig } from '@/libs/prisma';
import { ConfigService } from '@nestjs/config';
import { MissingEnvVarException } from '@/core/application';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService<PrismaConfig>) {
    super();

    const url = this.configService.get('APP_DATABASE_URL');

    if (!url) {
      throw new MissingEnvVarException(['APP_DATABASE_URL']);
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
