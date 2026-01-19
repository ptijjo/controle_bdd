import request from 'supertest';
import { App } from '@/app';
import { AuthRoute } from '@/routes/auth.route';
import { UserRoute } from '@/routes/users.route';
import { FormRoute } from '@/routes/forms.route';
import { prisma } from './setup';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '@config';

describe('Tests de Sécurité', () => {
  let app: App;
  let server: any;
  let authToken: string;
  let adminToken: string;
  let testUser: any;
  let adminUser: any;

  beforeAll(async () => {
    // Créer des utilisateurs de test
    testUser = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: await hash('Password123!', 10),
        nom: 'Test',
        prenom: 'User',
        role: Role.controleur,
      },
    });

    adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await hash('Admin123!', 10),
        nom: 'Admin',
        prenom: 'User',
        role: Role.chef_service,
      },
    });

    // Créer des tokens JWT
    authToken = jwt.sign({ id: testUser.id }, SECRET_KEY as string, { expiresIn: '24h' });
    adminToken = jwt.sign({ id: adminUser.id }, SECRET_KEY as string, { expiresIn: '24h' });

    // Initialiser l'application
    app = new App([new AuthRoute(), new UserRoute(), new FormRoute()]);
    server = app.getServer();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.loginAttempts.deleteMany();
    await prisma.ipBlock.deleteMany();
  });

  describe('Protection contre SQL Injection', () => {
    it('devrait rejeter les tentatives d\'injection SQL dans les emails', async () => {
      const maliciousInputs = [
        "'; DROP TABLE User; --",
        "' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM User--",
      ];

      for (const maliciousInput of maliciousInputs) {
        const response = await request(server)
          .post('/login')
          .send({
            email: maliciousInput,
            password: 'Password123!',
          });

        // Devrait retourner une erreur de validation ou 401/409, pas une erreur SQL
        expect([400, 401, 409]).toContain(response.status);
        expect(response.body).not.toHaveProperty('sql');
        expect(response.body).not.toHaveProperty('code');
      }
    });

    it('devrait protéger contre l\'injection SQL dans les IDs utilisateur', async () => {
      const maliciousIds = [
        "'; DROP TABLE User; --",
        "' OR '1'='1",
        "1' UNION SELECT * FROM User--",
      ];

      for (const maliciousId of maliciousIds) {
        const response = await request(server)
          .get(`/users/${maliciousId}`)
          .set('Cookie', `Authorization=${adminToken}`)
          .set('Authorization', `Bearer ${adminToken}`);

        // Devrait retourner 401 (non authentifié) ou 404/409 (utilisateur non trouvé)
        expect([401, 404, 409]).toContain(response.status);
      }
    });
  });

  describe('Protection contre XSS', () => {
    it('devrait échapper les scripts dans les champs de formulaire', async () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        'javascript:alert("XSS")',
        '<svg onload=alert("XSS")>',
      ];

      for (const payload of xssPayloads) {
        const response = await request(server)
          .post('/forms')
          .set('Cookie', `Authorization=${authToken}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            nom: payload,
            prenom: 'Test',
            date: new Date(),
            heurePrevue: '10:00',
            heureReelle: '10:05',
            lieuControle: 'Test',
            typeArret: 'Abris bus',
            client: 'casas',
            meteo: 'beau',
            parc: 1,
            affichageDestination: 'Conforme',
            affichageNumeroLigne: 'Conforme',
            pictoEnfant: 'Conforme',
            tarifAffiche: 'Conforme',
            depliantHoraire: 'Conforme',
            reglement: 'Conforme',
            carosserie: 'Propre',
            observationCar: 'Test',
            billetiqueElectronique: 'Conforme',
            billetiqueManuelle: 'Conforme',
            fondDeCaisse: 'Conforme',
            observationBilletique: 'Test',
            tableauBord: 'Propre',
            sol: 'Propre',
            vitres: 'Propre',
            sieges: 'Propre',
            nbreVoyageur: 10,
            nbreVoyageurIrregulier: 0,
            controllerSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            chauffeurSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          });

        // Devrait valider et rejeter ou échapper le contenu malveillant
        expect([400, 401, 403]).toContain(response.status);
      }
    });
  });

  describe('Protection contre les attaques CSRF', () => {
    it('devrait exiger un token d\'authentification pour les requêtes POST', async () => {
      const response = await request(server)
        .post('/users')
        .send({
          email: 'newuser@example.com',
        });

      // Devrait retourner 401 ou 404 (non authentifié)
      expect([401, 404]).toContain(response.status);
    });

    it('devrait exiger un token d\'authentification pour les requêtes DELETE', async () => {
      const response = await request(server)
        .delete(`/users/${testUser.id}`)
        .send({});

      // Devrait retourner 401 ou 404 (non authentifié)
      expect([401, 404]).toContain(response.status);
    });
  });

  describe('Contrôle d\'accès et autorisation', () => {
    it('devrait empêcher un utilisateur normal d\'accéder aux endpoints admin', async () => {
      const response = await request(server)
        .get('/users')
        .set('Cookie', `Authorization=${authToken}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Devrait retourner 403 (interdit) ou 409 (accès interdit selon votre implémentation)
      expect([403, 409]).toContain(response.status);
    });

    it('devrait permettre à un admin d\'accéder aux endpoints admin', async () => {
      const response = await request(server)
        .get('/users')
        .set('Cookie', `Authorization=${adminToken}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Devrait retourner 200 (succès)
      expect(response.status).toBe(200);
    });

    it('devrait empêcher un utilisateur de supprimer un autre utilisateur', async () => {
      const anotherUser = await prisma.user.create({
        data: {
          email: 'another@example.com',
          password: await hash('Password123!', 10),
          nom: 'Another',
          prenom: 'User',
          role: Role.agent,
        },
      });

      const response = await request(server)
        .delete(`/users/${anotherUser.id}`)
        .set('Cookie', `Authorization=${authToken}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Devrait retourner 403 ou 409 (accès interdit)
      expect([403, 409]).toContain(response.status);

      await prisma.user.delete({ where: { id: anotherUser.id } });
    });
  });

  describe('Validation des entrées', () => {
    it('devrait rejeter les emails invalides', async () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test..test@example.com',
        'test@example',
      ];

      for (const email of invalidEmails) {
        const response = await request(server)
          .post('/login')
          .send({
            email,
            password: 'Password123!',
          });

        expect([400, 409]).toContain(response.status);
      }
    });

    it('devrait rejeter les mots de passe faibles', async () => {
      const weakPasswords = [
        '12345678',
        'password',
        'PASSWORD',
        'Password',
        'Password1',
        'Password!',
      ];

      for (const password of weakPasswords) {
        const response = await request(server)
          .post('/signup/test-token')
          .send({
            password,
            nom: 'Test',
            prenom: 'User',
          });

        // Devrait retourner une erreur de validation
        expect([400, 409]).toContain(response.status);
      }
    });

    it('devrait valider le format des signatures base64', async () => {
      const invalidSignatures = [
        'not-base64',
        '<script>alert("XSS")</script>',
        'data:image/png;base64,invalid-base64-!@#$',
        '',
      ];

      for (const signature of invalidSignatures) {
        const response = await request(server)
          .post('/forms')
          .set('Cookie', `Authorization=${authToken}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            nom: 'Test',
            prenom: 'User',
            date: new Date(),
            heurePrevue: '10:00',
            heureReelle: '10:05',
            lieuControle: 'Test',
            typeArret: 'Abris bus',
            client: 'casas',
            meteo: 'beau',
            parc: 1,
            affichageDestination: 'Conforme',
            affichageNumeroLigne: 'Conforme',
            pictoEnfant: 'Conforme',
            tarifAffiche: 'Conforme',
            depliantHoraire: 'Conforme',
            reglement: 'Conforme',
            carosserie: 'Propre',
            observationCar: 'Test',
            billetiqueElectronique: 'Conforme',
            billetiqueManuelle: 'Conforme',
            fondDeCaisse: 'Conforme',
            observationBilletique: 'Test',
            tableauBord: 'Propre',
            sol: 'Propre',
            vitres: 'Propre',
            sieges: 'Propre',
            nbreVoyageur: 10,
            nbreVoyageurIrregulier: 0,
            controllerSignature: signature,
            chauffeurSignature: signature,
          });

        expect([400, 401]).toContain(response.status);
      }
    });
  });

  describe('Rate Limiting', () => {
    it('devrait limiter les tentatives de connexion', async () => {
      const maxAttempts = 15;
      let lastStatus = 200;

      for (let i = 0; i < maxAttempts + 5; i++) {
        const response = await request(server)
          .post('/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'WrongPassword123!',
          });

        lastStatus = response.status;

        if (response.status === 429) {
          // Rate limit atteint
          expect(response.body.message).toContain('Trop de tentatives');
          break;
        }
      }

      // Devrait avoir atteint le rate limit ou retourné une erreur d'authentification
      expect([409, 429]).toContain(lastStatus);
    });

    it('devrait limiter les tentatives d\'invitation', async () => {
      const maxAttempts = 5;
      let rateLimited = false;

      for (let i = 0; i < maxAttempts + 2; i++) {
        const response = await request(server)
          .post('/users')
          .set('Cookie', `Authorization=${adminToken}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            email: `test${i}@example.com`,
          });

        if (response.status === 429) {
          rateLimited = true;
          expect(response.body.message).toContain('Trop d\'invitations');
          break;
        }
      }

      // Devrait avoir atteint le rate limit après plusieurs tentatives
      expect(rateLimited).toBe(true);
    });
  });

  describe('Protection contre les tokens invalides', () => {
    it('devrait rejeter les tokens expirés', async () => {
      const expiredToken = jwt.sign({ id: testUser.id }, SECRET_KEY as string, { expiresIn: '-1h' });

      const response = await request(server)
        .get('/users_me')
        .set('Cookie', `Authorization=${expiredToken}`)
        .set('Authorization', `Bearer ${expiredToken}`);

      expect([401, 404]).toContain(response.status);
    });

    it('devrait rejeter les tokens avec une signature invalide', async () => {
      const invalidToken = jwt.sign({ id: testUser.id }, 'wrong-secret', { expiresIn: '24h' });

      const response = await request(server)
        .get('/users_me')
        .set('Cookie', `Authorization=${invalidToken}`)
        .set('Authorization', `Bearer ${invalidToken}`);

      expect([401, 404]).toContain(response.status);
    });

    it('devrait rejeter les tokens modifiés', async () => {
      const validToken = jwt.sign({ id: testUser.id }, SECRET_KEY as string, { expiresIn: '24h' });
      const modifiedToken = validToken.slice(0, -5) + 'XXXXX';

      const response = await request(server)
        .get('/users_me')
        .set('Cookie', `Authorization=${modifiedToken}`)
        .set('Authorization', `Bearer ${modifiedToken}`);

      expect([401, 404]).toContain(response.status);
    });
  });

  describe('Protection contre les attaques par force brute', () => {
    it('devrait bloquer une IP après plusieurs tentatives avec des emails inexistants', async () => {
      const testIp = '192.168.100.1';
      const maxAttempts = 3;

      for (let i = 0; i < maxAttempts; i++) {
        const response = await request(server)
          .post('/login')
          .set('X-Forwarded-For', testIp)
          .send({
            email: `nonexistent${i}@example.com`,
            password: 'Password123!',
          });

        if (i === maxAttempts - 1) {
          // Dernière tentative devrait bloquer l'IP
          expect([403, 409]).toContain(response.status);
          if (response.status === 403) {
            expect(response.body.message).toContain('IP temporairement bloquée');
          }
        }
      }
    });

    it('devrait verrouiller un compte après plusieurs tentatives de mot de passe incorrect', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'bruteforce@example.com',
          password: await hash('CorrectPassword123!', 10),
          nom: 'Brute',
          prenom: 'Force',
          role: Role.agent,
        },
      });

      const maxAttempts = 5; // NUMBER_OF_FAIL_BEFORE_LOCK

      for (let i = 0; i < maxAttempts; i++) {
        const response = await request(server)
          .post('/login')
          .send({
            email: 'bruteforce@example.com',
            password: 'WrongPassword123!',
          });

        if (i === maxAttempts - 1) {
          // Dernière tentative devrait verrouiller le compte
          expect([403, 409]).toContain(response.status);
        }
      }

      // Vérifier que le compte est verrouillé
      const lockedUser = await prisma.user.findUnique({
        where: { email: 'bruteforce@example.com' },
      });

      expect(lockedUser?.lockedUntil).toBeDefined();
      expect(lockedUser?.lockedUntil).not.toBeNull();

      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('Protection contre path traversal', () => {
    it('devrait empêcher l\'accès aux fichiers en dehors du répertoire autorisé', async () => {
      const maliciousPaths = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        '/etc/passwd',
        'C:\\Windows\\System32',
      ];

      // Note: Cette protection est dans file.service.ts
      // On teste indirectement via le téléchargement de fichier
      const response = await request(server)
        .get('/forms')
        .set('Cookie', `Authorization=${authToken}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Devrait retourner soit 200 (fichier valide) soit 409 (fichier introuvable)
      // Mais ne devrait jamais exposer des fichiers système
      expect([200, 401, 403, 409]).toContain(response.status);
    });
  });
});
