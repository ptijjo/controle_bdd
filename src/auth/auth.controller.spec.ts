import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';
import {
  AUTH_REFRESH_COOKIE,
  AUTH_REFRESH_COOKIE_PATH,
} from './auth.constants';
import { mockConfigServiceProvider } from '../test/mocks/config.mock';
import { createAllowAllGuard } from '../test/mocks/guards.mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginValidationGuard } from './guards/login-validation.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

describe('AuthController', () => {
  let controller: AuthController;
  const login = jest.fn();
  const logout = jest.fn();
  const register = jest.fn();
  const invitationUser = jest.fn();
  const verifyInvitationToken = jest.fn();
  const registerFromInvitation = jest.fn();
  const rotateWithRefreshToken = jest.fn();
  const configGet = jest.fn();

  beforeEach(async () => {
    login.mockReset();
    logout.mockReset();
    register.mockReset();
    invitationUser.mockReset();
    verifyInvitationToken.mockReset();
    registerFromInvitation.mockReset();
    rotateWithRefreshToken.mockReset();
    configGet.mockReset();
    configGet.mockImplementation((key: string, def?: string) => {
      if (key === 'REFRESH_TOKEN_EXPIRES_SEC') return '604800';
      return def;
    });

    const allowGuard = createAllowAllGuard();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            issueTokens: jest.fn(),
            rotateWithRefreshToken,
            login,
            logout,
            register,
            invitationUser,
            verifyInvitationToken,
            registerFromInvitation,
          },
        },
        mockConfigServiceProvider({
          get: (key: string, def?: string) => configGet(key, def),
        }),
      ],
    })
      .overrideGuard(LoginValidationGuard)
      .useValue(allowGuard)
      .overrideGuard(JwtAuthGuard)
      .useValue(allowGuard)
      .overrideGuard(RolesGuard)
      .useValue(allowGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should return the result of authService.register', async () => {
      const dto = {
        email: 'n@t.com',
        password: 'Aa1!aaaa',
        nom: 'D',
        prenom: 'J',
      };
      const created = { id: '1', email: dto.email, nom: dto.nom, prenom: dto.prenom };
      register.mockResolvedValue(created);

      const result = await controller.register(dto as never);

      expect(register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('invitation', () => {
    it('should call authService.invitationUser', async () => {
      const dto = { email: 'inv@t.com' };
      invitationUser.mockResolvedValue(undefined);

      await controller.invitation(dto as never);

      expect(invitationUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('verifyInvitation', () => {
    it('should return email from decoded token', async () => {
      verifyInvitationToken.mockResolvedValue({ email: 'inv@t.com' });

      const result = await controller.verifyInvitation('encoded%40token');

      expect(verifyInvitationToken).toHaveBeenCalledWith('encoded@token');
      expect(result).toEqual({ data: { email: 'inv@t.com' } });
    });
  });

  describe('registerInvite', () => {
    it('should delegate to authService.registerFromInvitation', async () => {
      const dto = {
        token: 't',
        nom: 'N',
        prenom: 'P',
        password: 'Aa1!aaaa',
      };
      const created = { id: '1', email: 'n@t.com', nom: 'N', prenom: 'P' };
      registerFromInvitation.mockResolvedValue(created);

      const result = await controller.registerInvite(dto as never);

      expect(registerFromInvitation).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('login', () => {
    it('should call login with client IP, set refresh cookie and return tokens', async () => {
      const userData = { email: 'u@t.com', password: 'Aa1!aaaa' };
      login.mockResolvedValue({
        access_token: 'at',
        cookie: 'rt',
        findUser: { id: '1', email: 'u@t.com' },
      });
      const cookie = jest.fn();
      const res = { cookie } as unknown as Response;
      const req = {
        headers: { 'x-forwarded-for': '198.51.100.2, 10.0.0.1' },
        socket: { remoteAddress: '10.0.0.1' },
      } as unknown as Request;

      const result = await controller.login(userData as never, req, res);

      expect(login).toHaveBeenCalledWith(userData, '198.51.100.2');
      expect(cookie).toHaveBeenCalledWith(
        AUTH_REFRESH_COOKIE,
        'rt',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: AUTH_REFRESH_COOKIE_PATH,
          maxAge: 604800 * 1000,
        }),
      );
      expect(result).toEqual({
        access_token: 'at',
        refresh_token: 'rt',
        user: { id: '1', email: 'u@t.com' },
      });
    });

    it('should use x-real-ip when x-forwarded-for is absent', async () => {
      login.mockResolvedValue({
        access_token: 'at',
        cookie: 'rt',
        findUser: { id: '1', email: 'u@t.com' },
      });
      const res = { cookie: jest.fn() } as unknown as Response;
      const req = {
        headers: { 'x-real-ip': ' 203.0.113.9 ' },
        socket: { remoteAddress: '127.0.0.1' },
      } as unknown as Request;

      await controller.login(
        { email: 'u@t.com', password: 'Aa1!aaaa' } as never,
        req,
        res,
      );

      expect(login).toHaveBeenCalledWith(
        { email: 'u@t.com', password: 'Aa1!aaaa' },
        '203.0.113.9',
      );
    });

    it('should fallback to socket.remoteAddress', async () => {
      login.mockResolvedValue({
        access_token: 'at',
        cookie: 'rt',
        findUser: { id: '1', email: 'u@t.com' },
      });
      const res = { cookie: jest.fn() } as unknown as Response;
      const req = {
        headers: {},
        socket: { remoteAddress: '5.6.7.8' },
      } as unknown as Request;

      await controller.login(
        { email: 'u@t.com', password: 'Aa1!aaaa' } as never,
        req,
        res,
      );

      expect(login).toHaveBeenCalledWith(
        { email: 'u@t.com', password: 'Aa1!aaaa' },
        '5.6.7.8',
      );
    });
  });

  describe('refresh', () => {
    it('should use refresh_token from cookie when present', async () => {
      rotateWithRefreshToken.mockResolvedValue({
        access_token: 'na',
        refresh_token: 'nr',
        user: { id: '1' } as never,
      });
      const cookie = jest.fn();
      const res = { cookie } as unknown as Response;
      const req = {
        cookies: { [AUTH_REFRESH_COOKIE]: 'from-cookie' },
      } as unknown as Request;

      const result = await controller.refresh(req, {} as never, res);

      expect(rotateWithRefreshToken).toHaveBeenCalledWith('from-cookie');
      expect(cookie).toHaveBeenCalledWith(
        AUTH_REFRESH_COOKIE,
        'nr',
        expect.objectContaining({ path: AUTH_REFRESH_COOKIE_PATH }),
      );
      expect(result.access_token).toBe('na');
      expect(result.refresh_token).toBe('nr');
    });

    it('should use refresh_token from body when cookie absent', async () => {
      rotateWithRefreshToken.mockResolvedValue({
        access_token: 'a',
        refresh_token: 'r',
        user: {} as never,
      });
      const res = { cookie: jest.fn() } as unknown as Response;
      const req = { cookies: {} } as unknown as Request;

      await controller.refresh(req, { refresh_token: 'body-rt' } as never, res);

      expect(rotateWithRefreshToken).toHaveBeenCalledWith('body-rt');
    });

    it('should throw UnauthorizedException when no refresh token', async () => {
      const res = { cookie: jest.fn() } as unknown as Response;
      const req = { cookies: {} } as unknown as Request;

      await expect(
        controller.refresh(req, {} as never, res),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(rotateWithRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call authService.logout and clear refresh cookie', () => {
      const clearCookie = jest.fn();
      const res = { clearCookie } as unknown as Response;

      controller.logout(res);

      expect(logout).toHaveBeenCalled();
      expect(clearCookie).toHaveBeenCalledWith(
        AUTH_REFRESH_COOKIE,
        expect.objectContaining({
          path: AUTH_REFRESH_COOKIE_PATH,
          httpOnly: true,
        }),
      );
    });
  });

  describe('me', () => {
    it('should return a serialized public profile from the request user', () => {
      const user = {
        id: '1',
        email: 'me@t.com',
        password: 'hash',
        failedLoginAttempts: 2,
        lockedUntil: new Date(),
      } as never;
      const req = { user } as never;

      const profile = controller.me(req as never);
      expect(profile.id).toBe('1');
      expect(profile.email).toBe('me@t.com');
      expect(profile).not.toHaveProperty('password');
      expect(profile).not.toHaveProperty('failedLoginAttempts');
      expect(profile).not.toHaveProperty('lockedUntil');
    });
  });
});
