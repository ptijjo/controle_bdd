import request from 'supertest';
import { createE2eApp, type E2eApp } from './helpers/create-e2e-app';
import { resetE2eDatabase } from './helpers/e2e-database';
import { applyE2eEnv } from './helpers/e2e-env';

applyE2eEnv();

describe('App (e2e)', () => {
  let app: E2eApp;

  beforeAll(async () => {
    await resetE2eDatabase();
    app = await createE2eApp();
  }, 60_000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET / — Hello World', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('Swagger désactivé en NODE_ENV=test', () => {
    return request(app.getHttpServer()).get('/docs').expect(404);
  });
});
