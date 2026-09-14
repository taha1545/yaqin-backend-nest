import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express'

import { AppModule } from './app.module';
import { SocketIoAdapter } from './core';
import { ValidationException } from './common';
import type { AppConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true, limit: '2mb' }))

  const configService = app.get(ConfigService<AppConfig, true>);

  const port = configService.get('app.port', { infer: true });
  const origins = configService.get('cors.origins', { infer: true }) ?? [];

  app.setGlobalPrefix('api/v1');

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  app.use(morgan(configService.get('app.env', { infer: true }) === 'production' ? 'combined' : 'dev'),);

  app.enableCors({ origin: origins, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  await app.listen(port);
}

bootstrap().catch((error: unknown) => {
  console.error('Unable to start Yaqin backend.', error);
  process.exit(1);
});
