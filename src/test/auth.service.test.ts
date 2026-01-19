import { AuthService } from '@/services/auth.service';
import { AuthDto, CreateUserDto } from '@/dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { prisma } from './setup';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  const testIpAddress = '192.168.1.1';

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('signup', () => {
    it('devrait créer un nouvel utilisateur avec un mot de passe hashé', async () => {
      const userData: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        nom: 'Test',
        prenom: 'User',
      };

      const user = await authService.signup(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.nom).toBe(userData.nom);
      expect(user.prenom).toBe(userData.prenom);
      expect(user.password).not.toBe(userData.password); // Le mot de passe doit être hashé
    });

    it('devrait lever une exception si l\'email existe déjà', async () => {
      const userData: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        nom: 'Test',
        prenom: 'User',
      };

      // Créer un utilisateur existant
      await prisma.user.create({
        data: {
          ...userData,
          password: await hash(userData.password, 10),
        },
      });

      await expect(authService.signup(userData)).rejects.toThrow(HttpException);
    });
  });

  describe('login', () => {
    let testUser: any;

    beforeEach(async () => {
      // Créer un utilisateur de test
      testUser = await prisma.user.create({
        data: {
          email: 'login@example.com',
          password: await hash('password123', 10),
          nom: 'Login',
          prenom: 'Test',
          role: Role.agent,
        },
      });
    });

    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const loginData: AuthDto = {
        email: 'login@example.com',
        password: 'password123',
      };

      const result = await authService.login(loginData, testIpAddress);

      expect(result.findUser).toBeDefined();
      expect(result.findUser.email).toBe(loginData.email);
      expect(result.cookie).toBeDefined();
      expect(result.cookie).toContain('Authorization=');
    });

    it('devrait lever une exception si l\'email n\'existe pas', async () => {
      const loginData: AuthDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await expect(authService.login(loginData, testIpAddress)).rejects.toThrow(HttpException);
    });

    it('devrait lever une exception si le mot de passe est incorrect', async () => {
      const loginData: AuthDto = {
        email: 'login@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(loginData, testIpAddress)).rejects.toThrow(HttpException);
    });

    it('devrait bloquer une IP après 3 tentatives avec des emails inexistants', async () => {
      const loginData: AuthDto = {
        email: 'nonexistent1@example.com',
        password: 'password123',
      };

      // Première tentative
      await expect(authService.login(loginData, testIpAddress)).rejects.toThrow(HttpException);

      // Deuxième tentative
      loginData.email = 'nonexistent2@example.com';
      await expect(authService.login(loginData, testIpAddress)).rejects.toThrow(HttpException);

      // Troisième tentative - devrait bloquer l'IP
      loginData.email = 'nonexistent3@example.com';
      await expect(authService.login(loginData, testIpAddress)).rejects.toThrow(
        /IP temporairement bloquée/
      );

      // Vérifier que l'IP est bloquée
      const ipBlock = await prisma.ipBlock.findUnique({
        where: { ipAddress: testIpAddress },
      });
      expect(ipBlock).toBeDefined();
      expect(ipBlock?.blockedUntil).toBeDefined();
      expect(ipBlock?.blockedUntil).not.toBeNull();
    });

    it('devrait réinitialiser les échecs de connexion après une connexion réussie', async () => {
      // Créer un utilisateur avec des échecs
      await prisma.user.update({
        where: { id: testUser.id },
        data: { failedLoginAttempts: 2 },
      });

      const loginData: AuthDto = {
        email: 'login@example.com',
        password: 'password123',
      };

      await authService.login(loginData, testIpAddress);

      const updatedUser = await prisma.user.findUnique({
        where: { id: testUser.id },
      });

      expect(updatedUser?.failedLoginAttempts).toBe(0);
      expect(updatedUser?.lockedUntil).toBeNull();
    });
  });

  describe('createToken', () => {
    it('devrait créer un token JWT valide', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'token@example.com',
          password: await hash('password123', 10),
          nom: 'Token',
          prenom: 'Test',
          role: Role.agent,
        },
      });

      const tokenData = authService.createToken(user);

      expect(tokenData).toBeDefined();
      expect(tokenData.token).toBeDefined();
      expect(tokenData.expiresIn).toBe(60 * 60 * 24); // 24 heures
    });
  });

  describe('createCookie', () => {
    it('devrait créer un cookie avec les bonnes propriétés', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'cookie@example.com',
          password: await hash('password123', 10),
          nom: 'Cookie',
          prenom: 'Test',
          role: Role.agent,
        },
      });

      const tokenData = authService.createToken(user);
      const cookie = authService.createCookie(tokenData);

      expect(cookie).toContain('Authorization=');
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('SameSite=None');
      expect(cookie).toContain('Secure');
      expect(cookie).toContain(`Max-Age=${tokenData.expiresIn}`);
    });
  });
});
