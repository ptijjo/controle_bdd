import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { PublicUser } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { AuthDto, CreateUserDto } from '@/dtos/users.dto';
import { TokenService } from '@/services/token.service';
import { HttpException } from '@/exceptions/httpException';
import { securityLogger, SecurityAction } from '@/utils/securityLogger';
import { UserService } from '@/services/users.service';

export class AuthController {
  public auth = Container.get(AuthService);
  public token = Container.get(TokenService);
  public userService = Container.get(UserService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Récupère les données du corps de la requête
      const userData: CreateUserDto = req.body;

      // Décodage du token d'invitation
      const decodedToken = await this.token.tokenInvitation(req.params.id);

      if (!decodedToken?.email) {
        throw new HttpException(400, "Email manquant dans le token d'invitation");
      }
      // Assigne l'email provenant du token
      userData.email = decodedToken.email;

      // Vérifie si l'email existe déjà
      const existingUser = await this.userService.user.findUnique({ where: { email: userData.email } });
      if (existingUser) {
        throw new HttpException(
          409,
          "Ce lien d'inscription ne peut plus être utilisé. Connectez-vous ou demandez une nouvelle invitation.",
        );
      }

      // Appel du service pour créer l'utilisateur
      const signUpUserData: PublicUser = await this.auth.signup(userData);

      // Log de la création de compte
      const ipAddress = String(req.ip || 'unknown');
      securityLogger.logAuth(
        SecurityAction.SIGNUP,
        signUpUserData.email,
        ipAddress,
        true,
        { userId: signUpUserData.id, role: signUpUserData.role }
      );

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  /** Vérifie le JWT d’invitation avant affichage du formulaire (pas de body, pas de CreateUserDto). */
  public verifyInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.params.id?.trim();
      if (!token) {
        throw new HttpException(400, "Token d'invitation manquant");
      }
      const { email } = await this.token.tokenInvitation(token);
      res.status(200).json({ data: { email }, message: 'Token valide' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: AuthDto = req.body;
      const ipAddress = String(req.ip || 'unknown');
      const { cookie, findUser } = await this.auth.login(userData, ipAddress);

      // Log de la connexion réussie
      securityLogger.logAuth(
        SecurityAction.LOGIN_SUCCESS,
        findUser.email,
        ipAddress,
        true,
        { userId: findUser.id, role: findUser.role }
      );

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      // Log de la connexion échouée
      const ipAddress = String(req.ip || 'unknown');
      securityLogger.logAuth(
        SecurityAction.LOGIN_FAILED,
        req.body.email || 'unknown',
        ipAddress,
        false,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: PublicUser = req.user;
      const ipAddress = String(req.ip || 'unknown');
      const logOutUserData: PublicUser = await this.auth.logout(userData);

      // Log de la déconnexion
      securityLogger.logAuth(
        SecurityAction.LOGOUT,
        logOutUserData.email,
        ipAddress,
        true,
        { userId: logOutUserData.id }
      );

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
