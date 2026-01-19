import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { AuthDto, CreateUserDto } from '@/dtos/users.dto';
import { TokenService } from '@/services/token.service';
import { HttpException } from '@/exceptions/httpException';
import { securityLogger, SecurityAction } from '@/utils/securityLogger';

export class AuthController {
  public auth = Container.get(AuthService);
  public token = Container.get(TokenService);

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

      // Appel du service pour créer l'utilisateur
      const signUpUserData: User = await this.auth.signup(userData);

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
      const userData: User = req.user;
      const ipAddress = String(req.ip || 'unknown');
      const logOutUserData: User = await this.auth.logout(userData);

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
