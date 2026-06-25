jest.mock('../src/utils/pdfCreator', () => ({
  generatePdf: jest.fn(async () => Buffer.from('%PDF-e2e')),
}));

jest.mock('../src/utils/saveToExcel', () => {
  const path = require('node:path') as typeof import('node:path');
  const os = require('node:os') as typeof import('node:os');
  const dir = path.join(os.tmpdir(), 'controle-e2e');
  return {
    saveFormToExcel: jest.fn(async () => 'enregistré-e2e'),
    getControleDir: jest.fn(() => dir),
    getControleExcelFilePath: jest.fn(() => path.join(dir, 'controle.xlsx')),
  };
});

import request from 'supertest';
import { AUTH_REFRESH_COOKIE } from '../src/auth/auth.constants';
import { validFormBody } from '../src/test/helpers/valid-form-body';
import { createE2eApp, type E2eApp } from './helpers/create-e2e-app';
import { resetE2eDatabase } from './helpers/e2e-database';
import {
  applyE2eEnv,
  E2E_SEEDER_EMAIL,
  E2E_SEEDER_PASSWORD,
} from './helpers/e2e-env';

applyE2eEnv();

async function loginAccessToken(app: E2eApp): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: E2E_SEEDER_EMAIL, password: E2E_SEEDER_PASSWORD })
    .expect(200);
  return res.body.access_token as string;
}

describe('Formulaire (e2e)', () => {
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

  it('POST /formulaire — sans JWT → 401', () => {
    return request(app.getHttpServer())
      .post('/formulaire')
      .send(validFormBody())
      .expect(401);
  });

  it('POST /formulaire — champ inconnu → 400', async () => {
    const token = await loginAccessToken(app);

    await request(app.getHttpServer())
      .post('/formulaire')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validFormBody(), unknownField: 'x' })
      .expect(400);
  });

  it('POST /formulaire — avec JWT → 201', async () => {
    const token = await loginAccessToken(app);

    const res = await request(app.getHttpServer())
      .post('/formulaire')
      .set('Authorization', `Bearer ${token}`)
      .send(validFormBody())
      .expect(201);

    expect(res.body.message).toBe('Formulaire crée avec succès');
    expect(res.body.data).toEqual({
      envoiPdf: 'resume-sent',
      saveExcel: 'enregistré-e2e',
    });
  });

  it('GET /formulaire/export — sans JWT → 401', () => {
    return request(app.getHttpServer()).get('/formulaire/export').expect(401);
  });

  it('GET /formulaire/export — avec JWT, fichier absent → 404', async () => {
    const token = await loginAccessToken(app);

    await request(app.getHttpServer())
      .get('/formulaire/export')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('POST /auth/login pose bien le cookie refresh (prérequis web)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: E2E_SEEDER_EMAIL, password: E2E_SEEDER_PASSWORD })
      .expect(200);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(
      Array.isArray(cookies)
        ? cookies.some((c: string) => c.startsWith(`${AUTH_REFRESH_COOKIE}=`))
        : String(cookies).includes(AUTH_REFRESH_COOKIE),
    ).toBe(true);
  });
});
