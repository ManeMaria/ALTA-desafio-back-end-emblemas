import { ConfigService } from '@nestjs/config';
import { CorsConfig } from '@/libs/cors';

const configService = new ConfigService<CorsConfig>();

const permitedUrls =
  configService.get('NODE_ENV') === 'production'
    ? [
        configService.get<string>('PRODUCTION_DEPLOY_URL'),
        configService.get<string>('PRODUCTION_FRONT_DEPLOY_URL'),
      ]
    : [
        configService.get<string>('STAGE_DEPLOY_URL'),
        configService.get<string>('STAGE_FRONT_DEPLOY_URL'),
      ];

export const corsOptions =
  configService.get('NODE_ENV') === 'local'
    ? { origin: '*' }
    : { origin: permitedUrls };
