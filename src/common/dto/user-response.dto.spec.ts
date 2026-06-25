import { Role } from '../../generated/prisma/client.js';
import { toUserResponseDto } from '../serialize-user.js';
import { UserResponseDto } from './user-response.dto.js';

describe('UserResponseDto / toUserResponseDto', () => {
  const fullUser = {
    id: 'user-1',
    email: 'agent@test.local',
    password: 'hashed-secret',
    nom: 'Dupont',
    prenom: 'Jean',
    role: Role.agent,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
    updatedAt: new Date('2024-01-02T10:00:00.000Z'),
    failedLoginAttempts: 2,
    lockedUntil: new Date('2025-01-01T10:00:00.000Z'),
  };

  it('should expose only public profile fields', () => {
    const dto = toUserResponseDto(fullUser);

    expect(dto).toBeInstanceOf(UserResponseDto);
    expect(dto).toEqual({
      id: 'user-1',
      email: 'agent@test.local',
      nom: 'Dupont',
      prenom: 'Jean',
      role: Role.agent,
      createdAt: fullUser.createdAt,
      updatedAt: fullUser.updatedAt,
    });
  });

  it('should not leak password or lockout metadata', () => {
    const dto = toUserResponseDto(fullUser) as Record<string, unknown>;

    expect(dto).not.toHaveProperty('password');
    expect(dto).not.toHaveProperty('failedLoginAttempts');
    expect(dto).not.toHaveProperty('lockedUntil');
  });
});
