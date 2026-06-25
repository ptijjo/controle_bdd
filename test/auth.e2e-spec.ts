import { applyE2eEnv, E2E_SEEDER_EMAIL, E2E_SEEDER_PASSWORD } from './helpers/e2e-env';
import { resetE2eDatabase } from './helpers/e2e-database';
import { createE2eApp, type E2eApp } from './helpers/create-e2e-app';
import request from 'supertest';
import { AUTH_REFRESH_COOKIE } from '../src/auth/auth.constants';

applyE2eEnv();

describe('Auth (e2e)', () => {
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

  it('POST /auth/login — corps invalide → 400', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'not-an-email' })
      .expect(400);
  });

  it('POST /auth/login — propriété inconnue → 400', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: E2E_SEEDER_EMAIL,
        password: E2E_SEEDER_PASSWORD,
        extra: 'hack',
      })
      .expect(400);
  });

  it('POST /auth/login — mauvais mot de passe → 409', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: E2E_SEEDER_EMAIL, password: 'wrong-password' })
      .expect(409);
  });

  it('POST /auth/login — succès → access_token + cookie refresh', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: E2E_SEEDER_EMAIL, password: E2E_SEEDER_PASSWORD })
      .expect(200);

    expect(res.body.access_token).toEqual(expect.any(String));
    expect(res.body.user?.email).toBe(E2E_SEEDER_EMAIL);
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(
      Array.isArray(cookies)
        ? cookies.some((c: string) => c.startsWith(`${AUTH_REFRESH_COOKIE}=`))
        : String(cookies).includes(`${AUTH_REFRESH_COOKIE}=`),
    ).toBe(true);
  });

  it('GET /auth/me — sans Bearer → 401', () => {
    return request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('GET /auth/me — avec Bearer → profil seeder', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: E2E_SEEDER_EMAIL, password: E2E_SEEDER_PASSWORD })
      .expect(200);

    const me = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${login.body.access_token}`)
      .expect(200);

    expect(me.body.email).toBe(E2E_SEEDER_EMAIL);
    expect(me.body).not.toHaveProperty('password');
    expect(me.body).not.toHaveProperty('failedLoginAttempts');
    expect(me.body).not.toHaveProperty('lockedUntil');
  });

  it('POST /auth/refresh — cookie refresh → nouveaux jetons', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/auth/login')
      .send({ email: E2E_SEEDER_EMAIL, password: E2E_SEEDER_PASSWORD })
      .expect(200);

    const refreshed = await agent.post('/auth/refresh').expect(200);

    expect(refreshed.body.access_token).toEqual(expect.any(String));
    expect(refreshed.body.user?.email).toBe(E2E_SEEDER_EMAIL);
  });

  it('POST /auth/refresh — sans cookie ni corps → 401', () => {
    return request(app.getHttpServer()).post('/auth/refresh').expect(401);
  });

  it('POST /auth/logout — avec Bearer → 204', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: E2E_SEEDER_EMAIL, password: E2E_SEEDER_PASSWORD })
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${login.body.access_token}`)
      .expect(204);
  });
});
