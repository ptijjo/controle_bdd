import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthUser } from '../types/auth-user.type';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function mockContext(user?: AuthUser): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;
  }

  it('should allow when no roles metadata', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const ctx = mockContext({ role: 'agent' } as AuthUser);

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow when user role is in required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
      'controleur',
      'chef_service',
    ]);
    const ctx = mockContext({
      id: '1',
      email: 'a@b.com',
      nom: 'A',
      prenom: 'B',
      role: 'chef_service',
      createdAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
      updatedAt: new Date(),
    });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should throw ForbiddenException when user is missing', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['controleur']);
    const ctx = mockContext(undefined);

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when user role is not allowed', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
      'controleur',
      'chef_service',
    ]);
    const ctx = mockContext({
      id: '1',
      email: 'a@b.com',
      nom: 'A',
      prenom: 'B',
      role: 'agent',
      createdAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
      updatedAt: new Date(),
    });

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
