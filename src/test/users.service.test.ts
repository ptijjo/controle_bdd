import { UserService } from '@/services/users.service';
import { CreateUserDto, CreateInvitationDto } from '@/dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { prisma } from './setup';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('findAllUser', () => {
    it('devrait retourner tous les utilisateurs', async () => {
      // Créer plusieurs utilisateurs
      await prisma.user.createMany({
        data: [
          {
            email: 'user1@example.com',
            password: await hash('password123', 10),
            nom: 'User',
            prenom: 'One',
            role: Role.agent,
          },
          {
            email: 'user2@example.com',
            password: await hash('password123', 10),
            nom: 'User',
            prenom: 'Two',
            role: Role.controleur,
          },
        ],
      });

      const users = await userService.findAllUser();

      expect(users).toBeDefined();
      expect(users.length).toBeGreaterThanOrEqual(2);
    });

    it('devrait retourner un tableau vide si aucun utilisateur n\'existe', async () => {
      const users = await userService.findAllUser();
      expect(users).toEqual([]);
    });
  });

  describe('findUserById', () => {
    it('devrait retourner un utilisateur par son ID', async () => {
      const createdUser = await prisma.user.create({
        data: {
          email: 'findbyid@example.com',
          password: await hash('password123', 10),
          nom: 'Find',
          prenom: 'ById',
          role: Role.agent,
        },
      });

      const user = await userService.findUserById(createdUser.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(createdUser.id);
      expect(user.email).toBe(createdUser.email);
    });

    it('devrait lever une exception si l\'utilisateur n\'existe pas', async () => {
      const fakeId = 'fake-id-12345';

      await expect(userService.findUserById(fakeId)).rejects.toThrow(HttpException);
    });
  });

  describe('invitationUser', () => {
    it('devrait créer un token d\'invitation et retourner un lien', async () => {
      const invitationData: CreateInvitationDto = {
        email: 'invite@example.com',
      };

      const link = await userService.invitationUser(invitationData);

      expect(link).toBeDefined();
      expect(link).toContain(invitationData.email.split('@')[0]);
    });

    it('devrait lever une exception si l\'email existe déjà', async () => {
      const existingUser = await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: await hash('password123', 10),
          nom: 'Existing',
          prenom: 'User',
          role: Role.agent,
        },
      });

      const invitationData: CreateInvitationDto = {
        email: existingUser.email,
      };

      await expect(userService.invitationUser(invitationData)).rejects.toThrow(HttpException);
    });
  });

  describe('updateUser', () => {
    it('devrait mettre à jour un utilisateur existant', async () => {
      const createdUser = await prisma.user.create({
        data: {
          email: 'update@example.com',
          password: await hash('password123', 10),
          nom: 'Update',
          prenom: 'Test',
          role: Role.agent,
        },
      });

      const updateData: CreateUserDto = {
        email: createdUser.email,
        password: 'newpassword123',
        nom: 'Updated',
        prenom: 'Name',
      };

      const updatedUser = await userService.updateUser(createdUser.id, updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.nom).toBe(updateData.nom);
      expect(updatedUser.prenom).toBe(updateData.prenom);
      expect(updatedUser.password).not.toBe(updateData.password); // Doit être hashé
    });

    it('devrait lever une exception si l\'utilisateur n\'existe pas', async () => {
      const fakeId = 'fake-id-12345';
      const updateData: CreateUserDto = {
        email: 'fake@example.com',
        password: 'password123',
        nom: 'Fake',
        prenom: 'User',
      };

      await expect(userService.updateUser(fakeId, updateData)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteUser', () => {
    it('devrait supprimer un utilisateur existant', async () => {
      const createdUser = await prisma.user.create({
        data: {
          email: 'delete@example.com',
          password: await hash('password123', 10),
          nom: 'Delete',
          prenom: 'Test',
          role: Role.agent,
        },
      });

      const deletedUser = await userService.deleteUser(createdUser.id);

      expect(deletedUser).toBeDefined();
      expect(deletedUser.id).toBe(createdUser.id);

      // Vérifier que l'utilisateur a été supprimé
      const user = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(user).toBeNull();
    });

    it('devrait lever une exception si l\'utilisateur n\'existe pas', async () => {
      const fakeId = 'fake-id-12345';

      await expect(userService.deleteUser(fakeId)).rejects.toThrow(HttpException);
    });
  });
});
