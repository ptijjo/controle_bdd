import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { User } from '../generated/prisma/client.js';
import { BcryptService } from '../utils/bcrpt';
import { createMockPrisma, mockPrismaServiceProvider } from '../test/mocks/prisma.mock';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  const prisma = createMockPrisma();
  const hashPassword = jest.fn();

  beforeEach(async () => {
    prisma.user.findUnique.mockReset();
    prisma.user.findMany.mockReset();
    prisma.user.update.mockReset();
    prisma.user.delete.mockReset();
    hashPassword.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        mockPrismaServiceProvider(prisma),
        { provide: BcryptService, useValue: { hashPassword } },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneUserByEmail', () => {
    it('should delegate to prisma.user.findUnique', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await service.findOneUserByEmail('x@test.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'x@test.com' },
      });
    });
  });

  describe('findOneUserById', () => {
    it('should delegate to prisma.user.findUnique by id', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await service.findOneUserById('id-1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'id-1' },
      });
    });
  });

  describe('findSafeUserById', () => {
    it('should return null when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      expect(await service.findSafeUserById('missing')).toBeNull();
    });

    it('should strip password from found user', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'id1',
        email: 'e@test.com',
        password: 'secret',
        nom: 'N',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      });

      const result = await service.findSafeUserById('id1');

      expect(result?.id).toBe('id1');
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('getAllUser', () => {
    it('should return all users without password', async () => {
      const u1: User = {
        id: '1',
        email: 'a@test.com',
        password: 'h1',
        nom: 'A',
        prenom: 'B',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      };
      const u2: User = {
        id: '2',
        email: 'c@test.com',
        password: 'h2',
        nom: 'C',
        prenom: 'D',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      };
      prisma.user.findMany.mockResolvedValue([u1, u2]);

      const result = await service.getAllUser();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[0].email).toBe('a@test.com');
      expect(result[1].email).toBe('c@test.com');
    });
  });

  describe('getUserById', () => {
    it('should throw NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should return user without password when found', async () => {
      const u: User = {
        id: 'id1',
        email: 'e@test.com',
        password: 'secret',
        nom: 'N',
        prenom: 'P',
        role: 'chef_service',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      };
      prisma.user.findUnique.mockResolvedValue(u);

      const result = await service.getUserById('id1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'id1' } });
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('id1');
      expect(result.email).toBe('e@test.com');
    });
  });

  describe('updateUser', () => {
    it('should throw NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUser('x', { nom: 'X' } as UpdateUserDto),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when dto is empty', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'id1',
        email: 'e@test.com',
        password: 'p',
        nom: 'N',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      });

      await expect(service.updateUser('id1', {})).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should hash password and update user', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'id1',
        email: 'e@test.com',
        password: 'old',
        nom: 'N',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      });
      hashPassword.mockResolvedValue('newhash');
      const updated: User = {
        id: 'id1',
        email: 'e@test.com',
        password: 'newhash',
        nom: 'New',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      };
      prisma.user.update.mockResolvedValue(updated);

      const dto: UpdateUserDto = { nom: 'New', password: 'Aa1!bbbb' };
      const result = await service.updateUser('id1', dto);

      expect(hashPassword).toHaveBeenCalledWith('Aa1!bbbb');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'id1' },
        data: { nom: 'New', password: 'newhash' },
      });
      expect(result).not.toHaveProperty('password');
      expect(result.nom).toBe('New');
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('should delete user when exists', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'id1',
        email: 'e@test.com',
        password: 'p',
        nom: 'N',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      });
      prisma.user.delete.mockResolvedValue({});

      await service.deleteUser('id1');

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'id1' } });
    });
  });
});
