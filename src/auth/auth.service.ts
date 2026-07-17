import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '../generated/prisma/client.js';
import { Role } from '../generated/prisma/client.js';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { BcryptService } from '../utils/bcrpt';
import type { AuthDto } from './dto/auth.dto';
import type { CreateInvitationDto } from './dto/create-invitation.dto';
import type { RegisterInviteDto } from './dto/register-invite.dto';
import type { JwtPayload } from './types/jwt-payload.type';
import type { AuthUser, PublicUser } from './types/auth-user.type';
import type { RefreshJwtPayload } from './types/refresh-jwt-payload.type';
import type { InvitationJwtPayload } from './types/invitation-jwt-payload.type';

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
};

export type LoginSuccess = {
  access_token: string;
  cookie: string;
  findUser: PublicUser;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Révoque le refresh JWT (jti) et tous les refresh actifs de l’utilisateur.
   */
  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      try {
        const refreshSecret = this.config.getOrThrow<string>(
          'REFRESH_TOKEN_SECRET',
        );
        const payload = await this.jwtService.verifyAsync<RefreshJwtPayload>(
          refreshToken,
          { secret: refreshSecret },
        );
        if (payload.sub === userId && payload.jti) {
          await this.prisma.refreshToken.updateMany({
            where: { jti: payload.jti, revokedAt: null },
            data: { revokedAt: new Date() },
          });
          return;
        }
      } catch {
        /* token déjà invalide — on révoque tout de même les sessions user */
      }
    }
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async login(userData: AuthDto, ipAddress: string): Promise<LoginSuccess> {
    const ipBlock = await this.prisma.ipBlock.findUnique({
      where: { ipAddress },
    });
    if (ipBlock?.blockedUntil) {
      if (ipBlock.blockedUntil > new Date()) {
        this.logger.warn({
          msg: 'Tentative de connexion depuis une IP bloquée',
          ipAddress,
          blockedUntil: ipBlock.blockedUntil,
          email: userData.email,
        });
        throw new ForbiddenException(
          `IP temporairement bloquée jusqu'à ${ipBlock.blockedUntil.toLocaleString('fr-FR')}`,
        );
      }
      await this.prisma.ipBlock.update({
        where: { ipAddress },
        data: { failedAttempts: 0, blockedUntil: null },
      });
    }

    const maybeUser = await this.userService.findOneUserByEmail(userData.email);
    if (!maybeUser) {
      await this.handleNonExistentEmail(ipAddress);
    }
    const findUser = maybeUser!;

    if (findUser.lockedUntil && findUser.lockedUntil > new Date()) {
      throw new ForbiddenException(
        `Compte temporairement verrouillé jusqu'à ${findUser.lockedUntil.toLocaleString('fr-FR')}`,
      );
    }

    const isPasswordMatching = await this.bcryptService.comparePassword(
      userData.password,
      findUser.password,
    );

    if (!isPasswordMatching) {
      await this.prisma.loginAttempts.create({
        data: {
          emailName: findUser.email,
          success: false,
          ipAddress,
        },
      });

      const maxFails = Number(
        this.config.get<string>('LOGIN_FAIL_BEFORE_ACCOUNT_LOCK') ?? '3',
      );
      const lockMinutes = Number(
        this.config.get<string>('LOGIN_ACCOUNT_LOCK_MINUTES') ?? '30',
      );
      let failed = findUser.failedLoginAttempts + 1;
      let lockedUntil: Date | null = null;
      if (failed >= maxFails) {
        lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
        failed = 0;
        this.logger.warn({
          msg: 'Compte verrouillé après échecs de mot de passe',
          ipAddress,
          email: findUser.email,
          userId: findUser.id,
          lockedUntil,
        });
      }

      await this.prisma.user.update({
        where: { email: findUser.email },
        data: { failedLoginAttempts: failed, lockedUntil },
      });

      throw new UnauthorizedException('Identifiants incorrects');
    }

    await this.prisma.user.update({
      where: { email: findUser.email },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });

    try {
      await this.prisma.ipBlock.deleteMany({ where: { ipAddress } });
    } catch {
      /* ignore */
    }

    const { password: _pw, ...publicUser } = findUser;
    void _pw;
    const tokens = await this.issueTokens(publicUser);

    return {
      access_token: tokens.access_token,
      cookie: tokens.refresh_token,
      findUser: publicUser,
    };
  }

  private async handleNonExistentEmail(ipAddress: string): Promise<void> {
    const maxFails = Number(
      this.config.get<string>('LOGIN_IP_FAIL_BEFORE_BLOCK') ?? '3',
    );
    const blockMinutes = Number(
      this.config.get<string>('LOGIN_IP_BLOCK_MINUTES') ?? '30',
    );

    const row = await this.prisma.ipBlock.findUnique({
      where: { ipAddress },
    });
    const fails = (row?.failedAttempts ?? 0) + 1;
    const shouldBlock = fails >= maxFails;
    const blockedUntil = shouldBlock
      ? new Date(Date.now() + blockMinutes * 60 * 1000)
      : null;

    await this.prisma.ipBlock.upsert({
      where: { ipAddress },
      create: {
        ipAddress,
        failedAttempts: 1,
        blockedUntil: 1 >= maxFails ? blockedUntil : null,
      },
      update: {
        failedAttempts: fails,
        blockedUntil,
      },
    });

    if (shouldBlock && blockedUntil) {
      this.logger.warn({
        msg: 'IP bloquée après tentatives sur e-mail inconnu',
        ipAddress,
        blockedUntil,
      });
      throw new ForbiddenException(
        `IP temporairement bloquée jusqu'à ${blockedUntil.toLocaleString('fr-FR')}`,
      );
    }

    throw new UnauthorizedException('Identifiants incorrects');
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findOneUserByEmail(email);
    if (user) {
      const isPasswordValid = await this.bcryptService.comparePassword(
        password,
        user.password,
      );
      if (isPasswordValid) {
        const { password: _pw, ...safeUser } = user;
        void _pw;
        return safeUser;
      }
    }
    return null;
  }

  async issueTokens(user: AuthUser): Promise<TokenPair> {
    const accessSecret = this.config.getOrThrow<string>('ACCESS_TOKEN_SECRET');
    const refreshSecret = this.config.getOrThrow<string>(
      'REFRESH_TOKEN_SECRET',
    );
    const accessExpiresSec = Number(
      this.config.get<string>('ACCESS_TOKEN_EXPIRES_SEC') ?? '900',
    );
    const refreshExpiresSec = Number(
      this.config.get<string>('REFRESH_TOKEN_EXPIRES_SEC') ?? '604800',
    );
    const refreshTtl = Number.isFinite(refreshExpiresSec)
      ? refreshExpiresSec
      : 604800;
    const jti = randomUUID();

    const accessPayload: JwtPayload = { sub: user.id };
    const refreshPayload: RefreshJwtPayload = { sub: user.id, jti };

    const access_token = this.jwtService.sign(accessPayload, {
      secret: accessSecret,
      expiresIn: Number.isFinite(accessExpiresSec) ? accessExpiresSec : 900,
    });
    const refresh_token = this.jwtService.sign(refreshPayload, {
      secret: refreshSecret,
      expiresIn: refreshTtl,
    });

    await this.prisma.refreshToken.create({
      data: {
        jti,
        userId: user.id,
        expiresAt: new Date(Date.now() + refreshTtl * 1000),
      },
    });

    return { access_token, refresh_token, user };
  }

  async rotateWithRefreshToken(refreshToken: string): Promise<TokenPair> {
    const refreshSecret = this.config.getOrThrow<string>(
      'REFRESH_TOKEN_SECRET',
    );
    let payload: RefreshJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<RefreshJwtPayload>(
        refreshToken,
        { secret: refreshSecret },
      );
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
    if (!payload.jti) {
      throw new UnauthorizedException('Refresh token invalide');
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });
    if (
      !stored ||
      stored.userId !== payload.sub ||
      stored.revokedAt ||
      stored.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Refresh token invalide ou révoqué');
    }

    await this.prisma.refreshToken.update({
      where: { jti: payload.jti },
      data: { revokedAt: new Date() },
    });

    const user = await this.userService.findSafeUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.issueTokens(user);
  }

  async invitationUser(invitationData: CreateInvitationDto): Promise<void> {
    const existing = await this.userService.findOneUserByEmail(
      invitationData.email,
    );
    if (existing) {
      throw new ConflictException('Cet e-mail est déjà pris.');
    }

    const invitationSecret = this.config.getOrThrow<string>(
      'SECRET_KEY_INVITATION',
    );
    const expiresSec = Number(
      this.config.get<string>('INVITATION_TOKEN_EXPIRES_SEC') ?? '604800',
    );

    const token = this.jwtService.sign(
      { email: invitationData.email, jti: randomUUID() },
      {
        secret: invitationSecret,
        expiresIn: Number.isFinite(expiresSec) ? expiresSec : 604800,
      },
    );

    const frontBase = this.config
      .getOrThrow<string>('FRONT_END')
      .replace(/\/$/, '');
    const link = `${frontBase}/${token}`;

    await this.mailService.sendInvitationEmail(invitationData.email, link);
  }

  async verifyInvitationToken(token: string): Promise<InvitationJwtPayload> {
    const invitationSecret = this.config.getOrThrow<string>(
      'SECRET_KEY_INVITATION',
    );
    try {
      const payload = await this.jwtService.verifyAsync<{
        email?: string;
        jti?: string;
      }>(token, { secret: invitationSecret });
      const email = payload.email?.trim();
      const jti = payload.jti?.trim();
      if (!email || !jti) {
        throw new UnauthorizedException('Invitation invalide');
      }
      return { email, jti };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invitation invalide ou expirée');
    }
  }

  async registerFromInvitation(
    dto: RegisterInviteDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, jti } = await this.verifyInvitationToken(dto.token);

    return this.prisma.$transaction(async (tx) => {
      const used = await tx.usedInvitation.findUnique({ where: { jti } });
      if (used) {
        throw new UnauthorizedException('Invitation déjà utilisée');
      }

      const existing = await tx.user.findUnique({ where: { email } });
      if (existing) {
        throw new ConflictException('Cet e-mail existe déjà.');
      }

      const hashedPassword = await this.bcryptService.hashPassword(dto.password);

      const created = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          nom: dto.nom,
          prenom: dto.prenom,
          role: Role.agent,
        },
      });

      await tx.usedInvitation.create({
        data: { jti, email },
      });

      const { password, ...safe } = created;
      void password;
      return safe;
    });
  }
}
