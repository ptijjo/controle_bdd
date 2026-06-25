import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { User } from '../../generated/prisma/client.js';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  const validateUser = jest.fn();

  const safeUser: Omit<User, 'password'> = {
    id: 'user-1',
    email: 'user@test.com',
    nom: 'Dupont',
    prenom: 'Jean',
    role: 'agent',
    createdAt: new Date(),
    updatedAt: new Date(),
    failedLoginAttempts: 0,
    lockedUntil: null,
  };

  beforeEach(async () => {
    validateUser.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: { validateUser },
        },
      ],
    }).compile();

    strategy = module.get(LocalStrategy);
  });

  it('should return user when credentials are valid', async () => {
    validateUser.mockResolvedValue(safeUser);

    const result = await strategy.validate('user@test.com', 'secret');

    expect(validateUser).toHaveBeenCalledWith('user@test.com', 'secret');
    expect(result).toEqual(safeUser);
  });

  it('should throw UnauthorizedException when credentials are invalid', async () => {
    validateUser.mockResolvedValue(null);

    await expect(
      strategy.validate('user@test.com', 'wrong'),
    ).rejects.toThrow('Email ou mot de passe incorrect');
  });
});
