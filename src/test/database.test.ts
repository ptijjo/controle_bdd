import { prisma } from './setup';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';

describe('Database Models', () => {
  describe('User Model', () => {
    it('devrait créer un utilisateur avec tous les champs requis', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'dbuser@example.com',
          password: await hash('password123', 10),
          nom: 'Database',
          prenom: 'User',
          role: Role.agent,
        },
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('dbuser@example.com');
      expect(user.nom).toBe('Database');
      expect(user.prenom).toBe('User');
      expect(user.role).toBe(Role.agent);
      expect(user.failedLoginAttempts).toBe(0);
      expect(user.lockedUntil).toBeNull();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('devrait empêcher la création de deux utilisateurs avec le même email', async () => {
      const email = 'unique@example.com';
      await prisma.user.create({
        data: {
          email,
          password: await hash('password123', 10),
          nom: 'First',
          prenom: 'User',
          role: Role.agent,
        },
      });

      await expect(
        prisma.user.create({
          data: {
            email,
            password: await hash('password123', 10),
            nom: 'Second',
            prenom: 'User',
            role: Role.agent,
          },
        })
      ).rejects.toThrow();
    });

    it('devrait mettre à jour failedLoginAttempts et lockedUntil', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'locktest@example.com',
          password: await hash('password123', 10),
          nom: 'Lock',
          prenom: 'Test',
          role: Role.agent,
        },
      });

      const lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 3,
          lockedUntil,
        },
      });

      expect(updatedUser.failedLoginAttempts).toBe(3);
      expect(updatedUser.lockedUntil).toBeDefined();
      expect(updatedUser.lockedUntil?.getTime()).toBeCloseTo(lockedUntil.getTime(), -3);
    });
  });

  describe('LoginAttempts Model', () => {
    it('devrait créer un enregistrement de tentative de connexion', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'attempt@example.com',
          password: await hash('password123', 10),
          nom: 'Attempt',
          prenom: 'Test',
          role: Role.agent,
        },
      });

      const attempt = await prisma.loginAttempts.create({
        data: {
          email: { connect: { email: user.email } },
          success: false,
          ipAddress: '192.168.1.100',
        },
      });

      expect(attempt).toBeDefined();
      expect(attempt.success).toBe(false);
      expect(attempt.ipAddress).toBe('192.168.1.100');
      expect(attempt.emailName).toBe(user.email);
      expect(attempt.createdAt).toBeDefined();
    });

    it('devrait supprimer les tentatives de connexion quand l\'utilisateur est supprimé (CASCADE)', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'cascade@example.com',
          password: await hash('password123', 10),
          nom: 'Cascade',
          prenom: 'Test',
          role: Role.agent,
        },
      });

      await prisma.loginAttempts.create({
        data: {
          email: { connect: { email: user.email } },
          success: false,
          ipAddress: '192.168.1.100',
        },
      });

      await prisma.user.delete({
        where: { id: user.id },
      });

      const attempts = await prisma.loginAttempts.findMany({
        where: { emailName: user.email },
      });

      expect(attempts.length).toBe(0);
    });
  });

  describe('IpBlock Model', () => {
    it('devrait créer un blocage IP', async () => {
      const ipBlock = await prisma.ipBlock.create({
        data: {
          ipAddress: '192.168.1.200',
          failedAttempts: 1,
        },
      });

      expect(ipBlock).toBeDefined();
      expect(ipBlock.ipAddress).toBe('192.168.1.200');
      expect(ipBlock.failedAttempts).toBe(1);
      expect(ipBlock.blockedUntil).toBeNull();
      expect(ipBlock.createdAt).toBeDefined();
      expect(ipBlock.updatedAt).toBeDefined();
    });

    it('devrait empêcher la création de deux blocages pour la même IP', async () => {
      const ipAddress = '192.168.1.201';
      await prisma.ipBlock.create({
        data: {
          ipAddress,
          failedAttempts: 1,
        },
      });

      await expect(
        prisma.ipBlock.create({
          data: {
            ipAddress,
            failedAttempts: 2,
          },
        })
      ).rejects.toThrow();
    });

    it('devrait mettre à jour blockedUntil après 3 tentatives', async () => {
      const ipBlock = await prisma.ipBlock.create({
        data: {
          ipAddress: '192.168.1.202',
          failedAttempts: 2,
        },
      });

      const blockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      const updatedIpBlock = await prisma.ipBlock.update({
        where: { id: ipBlock.id },
        data: {
          failedAttempts: 3,
          blockedUntil,
        },
      });

      expect(updatedIpBlock.failedAttempts).toBe(3);
      expect(updatedIpBlock.blockedUntil).toBeDefined();
      expect(updatedIpBlock.blockedUntil?.getTime()).toBeCloseTo(blockedUntil.getTime(), -3);
    });
  });

  describe('Relations', () => {
    it('devrait pouvoir récupérer les tentatives de connexion d\'un utilisateur', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'relation@example.com',
          password: await hash('password123', 10),
          nom: 'Relation',
          prenom: 'Test',
          role: Role.agent,
        },
      });

      await prisma.loginAttempts.createMany({
        data: [
          {
            emailName: user.email,
            success: false,
            ipAddress: '192.168.1.1',
          },
          {
            emailName: user.email,
            success: true,
            ipAddress: '192.168.1.1',
          },
        ],
      });

      const userWithAttempts = await prisma.user.findUnique({
        where: { id: user.id },
        include: { LoginAttempts: true },
      });

      expect(userWithAttempts?.LoginAttempts).toBeDefined();
      expect(userWithAttempts?.LoginAttempts.length).toBe(2);
    });
  });
});
