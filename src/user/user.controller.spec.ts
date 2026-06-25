import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../generated/prisma/client.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const safeUser = {
  id: '1',
  email: 'u@test.local',
  nom: 'Dupont',
  prenom: 'Jean',
  role: Role.agent,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  password: 'secret',
  failedLoginAttempts: 3,
  lockedUntil: new Date(),
};

describe('UserController', () => {
  let controller: UserController;
  const getAllUser = jest.fn();
  const getUserById = jest.fn();
  const updateUser = jest.fn();
  const deleteUser = jest.fn();

  beforeEach(async () => {
    getAllUser.mockReset();
    getUserById.mockReset();
    updateUser.mockReset();
    deleteUser.mockReset();

    const mockGuard: CanActivate = { canActivate: () => true };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getAllUser,
            getUserById,
            updateUser,
            deleteUser,
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllUser should return serialized users without sensitive fields', async () => {
    getAllUser.mockResolvedValue([safeUser]);
    const result = await controller.getAllUser();
    expect(result).toHaveLength(1);
    expect(result[0]).not.toHaveProperty('password');
    expect(result[0]).not.toHaveProperty('failedLoginAttempts');
    expect(getAllUser).toHaveBeenCalled();
  });

  it('getUserById should return serialized user', async () => {
    getUserById.mockResolvedValue(safeUser);
    const result = await controller.getUserById('1');
    expect(result.id).toBe('1');
    expect(result).not.toHaveProperty('password');
    expect(getUserById).toHaveBeenCalledWith('1');
  });

  it('updateUser should return serialized user', async () => {
    const dto = { nom: 'X' };
    updateUser.mockResolvedValue({ ...safeUser, nom: 'X' });
    const result = await controller.updateUser('1', dto as never);
    expect(result.nom).toBe('X');
    expect(result).not.toHaveProperty('password');
    expect(updateUser).toHaveBeenCalledWith('1', dto);
  });

  it('deleteUser should delegate to service', async () => {
    deleteUser.mockResolvedValue(undefined);
    await controller.deleteUser('1');
    expect(deleteUser).toHaveBeenCalledWith('1');
  });
});
