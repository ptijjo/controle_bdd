import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { configureHttpApp } from './common/app-http.config';
import { setupSwaggerIfDevelopment } from './common/swagger.config';
import { closeSharedBrowser } from './utils/puppeteer-browser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const trustProxy = process.env.TRUST_PROXY;
  const httpInstance = app.getHttpAdapter().getInstance() as {
    set: (key: string, value: unknown) => void;
  };
  if (trustProxy === 'true' || trustProxy === '1') {
    httpInstance.set('trust proxy', 1);
  } else if (trustProxy && trustProxy !== 'false' && trustProxy !== '0') {
    const hops = Number(trustProxy);
    httpInstance.set(
      'trust proxy',
      Number.isFinite(hops) ? hops : trustProxy,
    );
  }

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

  const server = await app.listen(Number(process.env.PORT), () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });

  const shutdown = async () => {
    await closeSharedBrowser();
    await app.close();
    server.close();
  };
  process.once('SIGINT', () => {
    void shutdown();
  });
  process.once('SIGTERM', () => {
    void shutdown();
  });
}

void bootstrap();
