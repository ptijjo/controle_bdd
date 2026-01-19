import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { CreateInvitationDto } from '@/dtos/users.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { securityLogger, SecurityAction } from '@/utils/securityLogger';



export class UserController {
  public user = Container.get(UserService);
 
  
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getConnected = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void>=>{
    if (!req.user) {
      res.status(401).json({message:"Non authentifié"});
      return;
    }
    const { id, email, nom, prenom, role } = req.user;
    
   res.json({ id, email, nom, prenom,role });
  }

  public inviteUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateInvitationDto = req.body;
      const ipAddress = String(req.ip || 'unknown');

      // if (req.user.role !== Role.chef_service && req.user.role !== Role.controleur) {
      //   throw new HttpException(404, "Opération non authorisée !");
      // }

      const inviteUser = await this.user.invitationUser(data);

      // Log de l'invitation
      securityLogger.logUserAction(
        SecurityAction.USER_INVITED,
        req.user,
        undefined,
        data.email,
        ipAddress,
        { invitationLink: inviteUser }
      );

      res.status(200).json({ data: inviteUser, message: 'invitation envoyée !' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const userData: User = req.body;
      const ipAddress = String(req.ip || 'unknown');
      
      const oldUser = await this.user.findUserById(userId);
      const updateUserData: User = await this.user.updateUser(userId, userData);

      // Log de la modification
      const roleChanged = oldUser.role !== updateUserData.role;
      securityLogger.logUserAction(
        roleChanged ? SecurityAction.USER_ROLE_CHANGED : SecurityAction.USER_UPDATED,
        req.user,
        userId,
        updateUserData.email,
        ipAddress,
        {
          oldRole: oldUser.role,
          newRole: updateUserData.role,
          fieldsChanged: Object.keys(userData).filter(key => key !== 'password'),
        }
      );

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const ipAddress = String(req.ip || 'unknown');
      
      const deleteUserData: User = await this.user.deleteUser(userId);

      // Log de la suppression (action critique)
      securityLogger.logUserAction(
        SecurityAction.USER_DELETED,
        req.user,
        userId,
        deleteUserData.email,
        ipAddress,
        {
          deletedUserRole: deleteUserData.role,
          deletedUserName: `${deleteUserData.nom} ${deleteUserData.prenom}`,
        }
      );

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
