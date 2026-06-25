import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigServiceProvider } from '../test/mocks/config.mock';
import { createMockPrisma, mockPrismaServiceProvider } from '../test/mocks/prisma.mock';
import { mockMailServiceProvider } from '../test/mocks/mail.mock';
import { UserService } from '../user/user.service';
import { BcryptService } from '../utils/bcrpt';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterInviteDto } from './dto/register-invite.dto';

describe('AuthService', () => {
  let service: AuthService;
  const findOneUserByEmail = jest.fn();
  const findSafeUserById = jest.fn();
  const sendInvitationEmail = jest.fn();
  const jwtSign = jest.fn();
  const jwtVerifyAsync = jest.fn();
  const hashPassword = jest.fn();
  const comparePassword = jest.fn();
  const userCreate = jest.fn();
  const userUpdate = jest.fn();
  const prisma = createMockPrisma();

  beforeEach(async () => {
    findOneUserByEmail.mockReset();
    findSafeUserById.mockReset();
    sendInvitationEmail.mockReset();
    jwtSign.mockReset();
    jwtVerifyAsync.mockReset();
    hashPassword.mockReset();
    comparePassword.mockReset();
    userCreate.mockReset();
    userUpdate.mockReset();
    prisma.ipBlock.findUnique.mockReset();
    prisma.ipBlock.update.mockReset();
    prisma.ipBlock.upsert.mockReset();
    prisma.ipBlock.deleteMany.mockReset();
    prisma.loginAttempts.create.mockReset();
    prisma.user.create = userCreate;
    prisma.user.update = userUpdate;

    jwtSign.mockImplementation(
      (_payload: unknown, opts?: { secret?: string }) => {
        const secret = opts?.secret;
        if (secret === 'invitation-secret') return 'signed-invite-token';
        if (secret === 'refresh-secret') return 'refresh-jwt';
        if (secret === 'access-secret') return 'access-jwt';
        return 'jwt';
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneUserByEmail,
            findSafeUserById,
          },
        },
        { provide: BcryptService, useValue: { hashPassword, comparePassword } },
        {
          provide: JwtService,
          useValue: {
            sign: jwtSign,
            verifyAsync: jwtVerifyAsync,
          },
        },
        mockConfigServiceProvider(),
        mockMailServiceProvider({
          sendInvitationEmail,
          sendResume: jest.fn(),
        }),
        mockPrismaServiceProvider(prisma),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logout', () => {
    it('should run without error', () => {
      expect(() => service.logout()).not.toThrow();
    });
  });

  describe('login', () => {
    const authDto: AuthDto = {
      email: 'user@test.com',
      password: 'Aa1!aaaa',
    };
    const ip = '203.0.113.1';

    it('should reject when IP is actively blocked', async () => {
      const until = new Date(Date.now() + 60_000);
      prisma.ipBlock.findUnique.mockResolvedValue({
        id: 'b1',
        ipAddress: ip,
        failedAttempts: 3,
        blockedUntil: until,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.login(authDto, ip)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(findOneUserByEmail).not.toHaveBeenCalled();
    });

    it('should reset expired IP block then continue', async () => {
      const past = new Date(Date.now() - 60_000);
      prisma.ipBlock.findUnique.mockResolvedValueOnce({
        id: 'b1',
        ipAddress: ip,
        failedAttempts: 2,
        blockedUntil: past,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.ipBlock.update.mockResolvedValue({});
      findOneUserByEmail.mockResolvedValue({
        id: 'u1',
        email: authDto.email,
        password: 'hash',
        nom: 'N',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      });
      comparePassword.mockResolvedValue(true);
      userUpdate.mockResolvedValue({});
      prisma.ipBlock.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.login(authDto, ip);

      expect(prisma.ipBlock.update).toHaveBeenCalled();
      expect(result.access_token).toBe('access-jwt');
      expect(result.cookie).toBe('refresh-jwt');
      expect(result.findUser.email).toBe(authDto.email);
    });

    it('should throw Conflict when email is unknown (under IP threshold)', async () => {
      prisma.ipBlock.findUnique.mockResolvedValue(null);
      findOneUserByEmail.mockResolvedValue(null);
      prisma.ipBlock.upsert.mockResolvedValue({});

      await expect(service.login(authDto, ip)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prisma.ipBlock.upsert).toHaveBeenCalled();
    });

    it('should throw Forbidden when unknown emails reach IP threshold', async () => {
      prisma.ipBlock.findUnique.mockResolvedValue({
        id: 'b1',
        ipAddress: ip,
        failedAttempts: 2,
        blockedUntil: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      findOneUserByEmail.mockResolvedValue(null);
      prisma.ipBlock.upsert.mockResolvedValue({});

      await expect(service.login(authDto, ip)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('should reject when account is locked', async () => {
      prisma.ipBlock.findUnique.mockResolvedValue(null);
      const until = new Date(Date.now() + 60_000);
      findOneUserByEmail.mockResolvedValue({
        id: 'u1',
        email: authDto.email,
        password: 'hash',
        nom: 'N',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: until,
        updatedAt: new Date(),
      });

      await expect(service.login(authDto, ip)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('should lock account when failed attempts reach threshold', async () => {
      prisma.ipBlock.findUnique.mockResolvedValue(null);
      findOneUserByEmail.mockResolvedValue({
        id: 'u1',
        email: authDto.email,
        password: 'hash',
        nom: 'N',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 2,
        lockedUntil: null,
        updatedAt: new Date(),
      });
      comparePassword.mockResolvedValue(false);
      prisma.loginAttempts.create.mockResolvedValue({});
      userUpdate.mockResolvedValue({});

      await expect(service.login(authDto, ip)).rejects.toBeInstanceOf(
        ConflictException,
      );

      expect(userUpdate).toHaveBeenCalledWith({
        where: { email: authDto.email },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: expect.any(Date),
        },
      });
    });

    it('should record failed attempt and throw Conflict on bad password', async () => {
      prisma.ipBlock.findUnique.mockResolvedValue(null);
      findOneUserByEmail.mockResolvedValue({
        id: 'u1',
        email: authDto.email,
        password: 'hash',
        nom: 'N',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      });
      comparePassword.mockResolvedValue(false);
      prisma.loginAttempts.create.mockResolvedValue({});
      userUpdate.mockResolvedValue({});

      await expect(service.login(authDto, ip)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prisma.loginAttempts.create).toHaveBeenCalled();
      expect(userUpdate).toHaveBeenCalled();
    });

    it('should return access + refresh cookie value on success', async () => {
      prisma.ipBlock.findUnique.mockResolvedValue(null);
      findOneUserByEmail.mockResolvedValue({
        id: 'u1',
        email: authDto.email,
        password: 'hash',
        nom: 'N',
        prenom: 'P',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 1,
        lockedUntil: null,
        updatedAt: new Date(),
      });
      comparePassword.mockResolvedValue(true);
      userUpdate.mockResolvedValue({});
      prisma.ipBlock.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.login(authDto, ip);

      expect(result.access_token).toBe('access-jwt');
      expect(result.cookie).toBe('refresh-jwt');
      expect(result.findUser).not.toHaveProperty('password');
      expect(prisma.ipBlock.deleteMany).toHaveBeenCalled();
    });
  });

  describe('invitationUser', () => {
    const dto: CreateInvitationDto = { email: 'invite@example.com' };

    it('should throw ConflictException when the email is already registered', async () => {
      findOneUserByEmail.mockResolvedValue({
        id: 'u1',
        email: dto.email,
        password: 'hash',
        nom: 'X',
        prenom: 'Y',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      });

      await expect(service.invitationUser(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(findOneUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(jwtSign).not.toHaveBeenCalled();
      expect(sendInvitationEmail).not.toHaveBeenCalled();
    });

    it('should sign an invitation token, build the front link and send the invitation email when the email is free', async () => {
      findOneUserByEmail.mockResolvedValue(null);
      sendInvitationEmail.mockResolvedValue('success');

      await service.invitationUser(dto);

      expect(findOneUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(jwtSign).toHaveBeenCalledWith(
        { email: dto.email },
        expect.objectContaining({
          secret: 'invitation-secret',
          expiresIn: 86400,
        }),
      );
      expect(sendInvitationEmail).toHaveBeenCalledWith(
        dto.email,
        'https://front.test/signed-invite-token',
      );
    });
  });

  describe('register', () => {
    const dto: CreateUserDto = {
      email: 'new@example.com',
      password: 'Aa1!aaaa',
      nom: 'Dupont',
      prenom: 'Jean',
    };

    it('should throw ConflictException when the email is already registered', async () => {
      findOneUserByEmail.mockResolvedValue({
        id: 'u1',
        email: dto.email,
        password: 'x',
        nom: 'A',
        prenom: 'B',
        role: 'agent',
        createdAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      });

      await expect(service.register(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(hashPassword).not.toHaveBeenCalled();
      expect(userCreate).not.toHaveBeenCalled();
    });

    it('should hash password, create user and return without password when email is free', async () => {
      findOneUserByEmail.mockResolvedValue(null);
      hashPassword.mockResolvedValue('hashed-secret');
      const createdAt = new Date('2026-01-01');
      const updatedAt = new Date('2026-01-02');
      userCreate.mockResolvedValue({
        id: 'usr_new',
        email: dto.email,
        password: 'hashed-secret',
        nom: dto.nom,
        prenom: dto.prenom,
        role: 'agent',
        createdAt,
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt,
      });

      const result = await service.register(dto);

      expect(findOneUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(hashPassword).toHaveBeenCalledWith(dto.password);
      expect(userCreate).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          password: 'hashed-secret',
          nom: dto.nom,
          prenom: dto.prenom,
        },
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({
        id: 'usr_new',
        email: dto.email,
        nom: dto.nom,
        prenom: dto.prenom,
        role: 'agent',
        createdAt,
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt,
      });
    });

    it('should pass optional role to prisma when provided', async () => {
      findOneUserByEmail.mockResolvedValue(null);
      hashPassword.mockResolvedValue('hashed-secret');
      const dtoWithRole: CreateUserDto = {
        ...dto,
        email: 'chef@example.com',
        role: 'chef_service',
      };
      const createdAt = new Date();
      const updatedAt = new Date();
      userCreate.mockResolvedValue({
        id: 'id2',
        email: dtoWithRole.email,
        password: 'hashed-secret',
        nom: dtoWithRole.nom,
        prenom: dtoWithRole.prenom,
        role: 'chef_service',
        createdAt,
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt,
      });

      await service.register(dtoWithRole);

      expect(userCreate).toHaveBeenCalledWith({
        data: {
          email: dtoWithRole.email,
          password: 'hashed-secret',
          nom: dtoWithRole.nom,
          prenom: dtoWithRole.prenom,
          role: 'chef_service',
        },
      });
    });
  });

  describe('validateUser', () => {
    const fullUser = {
      id: 'u1',
      email: 'user@test.com',
      password: 'hash',
      nom: 'N',
      prenom: 'P',
      role: 'agent' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
    };

    it('should return user without password when credentials match', async () => {
      findOneUserByEmail.mockResolvedValue(fullUser);
      comparePassword.mockResolvedValue(true);

      const result = await service.validateUser('user@test.com', 'Aa1!aaaa');

      expect(result?.email).toBe('user@test.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when password is wrong', async () => {
      findOneUserByEmail.mockResolvedValue(fullUser);
      comparePassword.mockResolvedValue(false);

      expect(await service.validateUser('user@test.com', 'wrong')).toBeNull();
    });

    it('should return null when email is unknown', async () => {
      findOneUserByEmail.mockResolvedValue(null);

      expect(await service.validateUser('unknown@test.com', 'x')).toBeNull();
    });
  });

  describe('issueTokens', () => {
    it('should sign access and refresh JWTs', () => {
      const user = {
        id: 'u1',
        email: 'u@test.com',
        nom: 'N',
        prenom: 'P',
        role: 'agent' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      };

      const tokens = service.issueTokens(user);

      expect(tokens.access_token).toBe('access-jwt');
      expect(tokens.refresh_token).toBe('refresh-jwt');
      expect(tokens.user).toEqual(user);
      expect(jwtSign).toHaveBeenCalledTimes(2);
    });
  });

  describe('rotateWithRefreshToken', () => {
    const safeUser = {
      id: 'u1',
      email: 'u@test.com',
      nom: 'N',
      prenom: 'P',
      role: 'agent' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
    };

    it('should return a new token pair for a valid refresh JWT', async () => {
      jwtVerifyAsync.mockResolvedValue({ sub: 'u1' });
      findSafeUserById.mockResolvedValue(safeUser);

      const result = await service.rotateWithRefreshToken('refresh-jwt');

      expect(jwtVerifyAsync).toHaveBeenCalledWith('refresh-jwt', {
        secret: 'refresh-secret',
      });
      expect(result.access_token).toBe('access-jwt');
      expect(result.user.id).toBe('u1');
    });

    it('should throw when refresh JWT is invalid', async () => {
      jwtVerifyAsync.mockRejectedValue(new Error('invalid'));

      await expect(
        service.rotateWithRefreshToken('bad-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw when user no longer exists', async () => {
      jwtVerifyAsync.mockResolvedValue({ sub: 'gone' });
      findSafeUserById.mockResolvedValue(null);

      await expect(
        service.rotateWithRefreshToken('refresh-jwt'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('verifyInvitationToken', () => {
    it('should return email from valid invitation token', async () => {
      jwtVerifyAsync.mockResolvedValue({ email: '  invite@test.com  ' });

      const result = await service.verifyInvitationToken('token');

      expect(result).toEqual({ email: 'invite@test.com' });
    });

    it('should throw when email is missing in payload', async () => {
      jwtVerifyAsync.mockResolvedValue({ email: '' });

      await expect(service.verifyInvitationToken('token')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('should throw when token verification fails', async () => {
      jwtVerifyAsync.mockRejectedValue(new Error('expired'));

      await expect(service.verifyInvitationToken('token')).rejects.toThrow(
        'Invitation invalide ou expirée',
      );
    });
  });

  describe('registerFromInvitation', () => {
    it('should register user with email from invitation token', async () => {
      jwtVerifyAsync.mockResolvedValue({ email: 'new@test.com' });
      findOneUserByEmail.mockResolvedValue(null);
      hashPassword.mockResolvedValue('hashed');
      const createdAt = new Date();
      userCreate.mockResolvedValue({
        id: 'id-new',
        email: 'new@test.com',
        password: 'hashed',
        nom: 'Nom',
        prenom: 'Pre',
        role: 'agent',
        createdAt,
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: createdAt,
      });

      const dto: RegisterInviteDto = {
        token: 'invite-token',
        nom: 'Nom',
        prenom: 'Pre',
        password: 'Aa1!bbbb',
      };

      const result = await service.registerFromInvitation(dto);

      expect(result.email).toBe('new@test.com');
      expect(userCreate).toHaveBeenCalled();
    });
  });
});
