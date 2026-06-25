import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { User } from '../../generated/prisma/client.js';
import { mockConfigServiceProvider } from '../../test/mocks/config.mock';
import { UserService } from '../../user/user.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  const findSafeUserById = jest.fn();

  const safeUser: Omit<User, 'password'> = {
    id: 'user-1',
    email: 'agent@test.local',
    nom: 'Martin',
    prenom: 'Paul',
    role: 'agent',
    createdAt: new Date(),
    updatedAt: new Date(),
    failedLoginAttempts: 0,
    lockedUntil: null,
  };

  beforeEach(async () => {
    findSafeUserById.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        mockConfigServiceProvider(),
        {
          provide: UserService,
          useValue: { findSafeUserById },
        },
      ],
    }).compile();

    strategy = module.get(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('validate should return user loaded from database', async () => {
    findSafeUserById.mockResolvedValue(safeUser);

    const result = await strategy.validate({ sub: 'user-1' });

    expect(findSafeUserById).toHaveBeenCalledWith('user-1');
    expect(result).toEqual(safeUser);
  });

  it('validate should throw UnauthorizedException when user is missing', async () => {
    findSafeUserById.mockResolvedValue(null);

    await expect(strategy.validate({ sub: 'missing' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
