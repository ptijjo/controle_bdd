import { BadRequestException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { LoginValidationGuard } from './login-validation.guard';

function createContext(body: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ body }),
    }),
  } as ExecutionContext;
}

describe('LoginValidationGuard', () => {
  const guard = new LoginValidationGuard();

  it('should allow valid login body', () => {
    expect(
      guard.canActivate(
        createContext({ email: 'user@test.com', password: 'secret' }),
      ),
    ).toBe(true);
  });

  it('should throw BadRequestException for invalid email', () => {
    expect(() =>
      guard.canActivate(createContext({ email: 'not-email', password: 'x' })),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when password is empty', () => {
    expect(() =>
      guard.canActivate(createContext({ email: 'u@test.com', password: '' })),
    ).toThrow(BadRequestException);
  });

  it('should reject unknown properties on login body', () => {
    expect(() =>
      guard.canActivate(
        createContext({
          email: 'u@test.com',
          password: 'secret',
          hacker: 'field',
        }),
      ),
    ).toThrow(BadRequestException);
  });
});
