import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import {
  DefaultExceptionFilter,
  HttpExceptionFilter,
  shutdown,
} from '@/libs/nest';
import { ApiUsersModule } from './apps/api-users/infra/nest/modules/api_users.module';
import { corsOptions } from './libs/cors/nest/services/cors';

function openapi(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('badge redemption')
    .setDescription('The badge redemption API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup('docs', app, document, customOptions);
}

let app: INestApplication = null;

async function bootstrap() {
  app = await NestFactory.create(ApiUsersModule, {
    logger: ['error', 'warn', 'debug'],
  });

  app.setGlobalPrefix('api', {
    exclude: ['docs'],
  });

  const configService = app.get(ConfigService);

  app.enableCors(corsOptions);

  const appPort = configService.get<number>(
    'API_PORT',
    Number(process.env.PORT) ?? 5000,
  );
  const appEnv = configService.get<string>('NODE_ENV', process.env.NODE_ENV);

  // Build OpenAPI server.
  if (appEnv !== 'production') {
    openapi(app);
  }

  app.useGlobalFilters(new DefaultExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Enable graceful shutdown
  app.enableShutdownHooks();

  await app.listen(appPort, () => {
    appEnv === 'local' &&
      console.log(
        `\x1b[32mServer is running on: http://localhost:${appPort}\x1b[0m`,
      );
  });
}

bootstrap().catch((error) => shutdown(app, error));
