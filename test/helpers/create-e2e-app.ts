import { INestApplication } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import type { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { configureHttpApp } from '../../src/common/app-http.config';
import { MailService } from '../../src/mail/mail.service';
import { SeederService } from '../../src/seeder/seeder.service';
import { mockMailServiceProvider } from '../../src/test/mocks/mail.mock';

export type E2eApp = INestApplication<App>;

export async function createE2eApp(
  configure?: (builder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<E2eApp> {
  const noopSeeder = {
    onModuleInit: async (): Promise<void> => undefined,
    ensureControleurSeeder: async (): Promise<void> => undefined,
  };

  let builder = Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailService)
    .useValue(mockMailServiceProvider().useValue)
    .overrideProvider(SeederService)
    .useValue(noopSeeder);

  if (configure) {
    builder = configure(builder);
  }

  const moduleFixture = await builder.compile();
  const app = moduleFixture.createNestApplication();
  app.use(cookieParser());
  configureHttpApp(app);
  await app.init();
  return app;
}
