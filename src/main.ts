import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';

import helmet from 'helmet';

import { AppModule } from './app.module';

import { configureHttpApp } from './common/app-http.config';

import { setupSwaggerIfDevelopment } from './common/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  configureHttpApp(app);

  setupSwaggerIfDevelopment(app);

  app.use(helmet());

  app.enableCors({
    origin: process.env.ORIGIN,

    credentials: process.env.CREDENTIALS === 'true',

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],

    exposedHeaders: ['Content-Range', 'X-Total-Count'],

    preflightContinue: false,

    optionsSuccessStatus: 204,

    maxAge: 600,
  });

  await app.listen(Number(process.env.PORT), () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}

void bootstrap();
