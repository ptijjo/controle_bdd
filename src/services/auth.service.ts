import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { JWT_ALGORITHM } from '@/constants/jwt';
import { NODE_ENV, NUMBER_OF_FAIL_BEFORE_LOCK, SECRET_KEY, TIME_LOCK } from '@config';
import { AuthDto, CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { PublicUser, User } from '@interfaces/users.interface';
import prisma from '@/utils/prisma';
import { toPublicUser } from '@/utils/publicUser';
import { securityLogger, SecurityAction } from '@/utils/securityLogger';

@Service()
export class AuthService {
  private users = prisma.user;

  public async signup(userData: CreateUserDto): Promise<PublicUser> {
    const findUser: User | null = await this.users.findUnique({ where: { email: userData.email } });
    if (findUser) {
      throw new HttpException(409, "La création du compte n'a pas pu aboutir.");
    }

    const hashedPassword = await hash(userData.password, 10);
    const created = await this.users.create({
      data: { ...userData, password: hashedPassword },
      omit: { password: true },
    });

    return created;
  }

  public async login(userData: AuthDto, ipAddressData: string): Promise<{ cookie: string; findUser: PublicUser }> {
    // Vérifier si l'IP est bloquée pour tentatives d'emails inexistants
    const ipBlock = await prisma.ipBlock.findUnique({ where: { ipAddress: ipAddressData } });
    if (ipBlock && ipBlock.blockedUntil && ipBlock.blockedUntil > new Date()) {
      securityLogger.logSecurityEvent(
        SecurityAction.IP_BLOCKED,
        ipAddressData,
        { email: userData.email, blockedUntil: ipBlock.blockedUntil }
      );
      throw new HttpException(403, `IP temporairement bloquée jusqu'à ${ipBlock.blockedUntil.toLocaleString('fr-FR')}`);
    }

    const findUser = await this.users.findUnique({ where: { email: userData.email } });

    // Si l'email n'existe pas, tracker la tentative et bloquer après 3 échecs
    if (!findUser) {
      // handleNonExistentEmail peut lever une exception si l'IP est bloquée
      await this.handleNonExistentEmail(ipAddressData);
      // Si pas bloquée, lever l'exception générique
      throw new HttpException(409, `Identifiants incorrects`);
    }

    //  Vérifier si le compte est temporairement verrouillé
    if (findUser.lockedUntil && findUser.lockedUntil > new Date()) {
      throw new HttpException(403, `Compte temporairement verrouillé jusqu'à ${findUser.lockedUntil}`);
    }

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) {
      await prisma.loginAttempts.create({
        data: {
          ipAddress: ipAddressData,
          email: { connect: { email: findUser.email } },
          success: false,
        },
      });
      let failed = findUser.failedLoginAttempts + 1;
      let lockedUntil: Date | null = null;

      if (failed >= Number(NUMBER_OF_FAIL_BEFORE_LOCK)) {
        lockedUntil = new Date(Date.now() + Number(TIME_LOCK) * 60 * 1000); // verrouillage 30 min
        failed = 0;
        
        // Log du verrouillage de compte
        securityLogger.logSecurityEvent(
          SecurityAction.ACCOUNT_LOCKED,
          ipAddressData,
          { email: findUser.email, userId: findUser.id, lockedUntil, failedAttempts: failed }
        );
      }

      await prisma.user.update({
        where: { email: findUser.email },
        data: { failedLoginAttempts: failed, lockedUntil },
      });

      throw new HttpException(409, 'Identifiants incorrects');
    }

    //  Réinitialiser les échecs
    await prisma.user.update({
      where: { email: findUser.email },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser: toPublicUser(findUser) };
  }

  public async logout(userData: PublicUser): Promise<PublicUser> {
    const findUser = await this.users.findUnique({
      where: { id: userData.id },
      omit: { password: true },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public createToken(user: Pick<User, 'id'>): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60 * 24; /*SECRET_EXPIRES as unknown as number*/

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn, algorithm: JWT_ALGORITHM }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    const secure = NODE_ENV === 'production' ? '; Secure' : '';
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/; SameSite=Lax${secure}`;
  }

  private async handleNonExistentEmail(ipAddress: string): Promise<void> {
    const MAX_ATTEMPTS = 3;
    const BLOCK_DURATION_MINUTES = Number(TIME_LOCK) || 30; // Utilise TIME_LOCK ou 30 min par défaut

    // Chercher ou créer l'enregistrement IP
    let ipBlock = await prisma.ipBlock.findUnique({ where: { ipAddress } });

    if (!ipBlock) {
      // Créer un nouvel enregistrement pour cette IP
      ipBlock = await prisma.ipBlock.create({
        data: {
          ipAddress,
          failedAttempts: 1,
        },
      });
    } else {
      // Si le blocage a expiré, réinitialiser
      if (ipBlock.blockedUntil && ipBlock.blockedUntil <= new Date()) {
        ipBlock = await prisma.ipBlock.update({
          where: { ipAddress },
          data: {
            failedAttempts: 1,
            blockedUntil: null,
          },
        });
      } else {
        // Incrémenter les tentatives
        const newFailedAttempts = ipBlock.failedAttempts + 1;
        let blockedUntil: Date | null = null;

        // Bloquer après 3 échecs
        if (newFailedAttempts >= MAX_ATTEMPTS) {
          blockedUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);
          
          // Log du blocage d'IP
          securityLogger.logSecurityEvent(
            SecurityAction.IP_BLOCKED,
            ipAddress,
            { failedAttempts: newFailedAttempts, blockedUntil }
          );
        }

        ipBlock = await prisma.ipBlock.update({
          where: { ipAddress },
          data: {
            failedAttempts: newFailedAttempts,
            blockedUntil,
          },
        });
      }
    }

    // Si l'IP vient d'être bloquée, lever une exception
    if (ipBlock.blockedUntil && ipBlock.blockedUntil > new Date()) {
      throw new HttpException(403, `IP temporairement bloquée jusqu'à ${ipBlock.blockedUntil.toLocaleString('fr-FR')} après ${MAX_ATTEMPTS} tentatives avec des emails inexistants`);
    }
  }
}
