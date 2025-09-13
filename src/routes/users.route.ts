import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RoleGuard } from '@/middlewares/role.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,AuthMiddleware,RoleGuard(["chef_service"]), this.user.getUsers);
    this.router.get(`${this.path}/:id`,AuthMiddleware,RoleGuard(["chef_service"]), this.user.getUserById);
    this.router.post(`${this.path}`,/*AuthMiddleware,RoleGuard(["chef_service"]),*/ this.user.inviteUser);
    this.router.put(`${this.path}/:id`,AuthMiddleware,RoleGuard(["chef_service"]), ValidationMiddleware(CreateUserDto, true), this.user.updateUser);
    this.router.delete(`${this.path}/:id`,AuthMiddleware,RoleGuard(["chef_service"]), this.user.deleteUser);
  }
}
