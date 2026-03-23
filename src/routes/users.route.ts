import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateInvitationDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RoleGuard } from '@/middlewares/role.middleware';
import { readRateLimiter, writeRateLimiter, deleteRateLimiter, inviteRateLimiter } from '@/middlewares/rateLimit.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Endpoints de lecture - rate limiting permissif
    this.router.get(`${this.path}`, readRateLimiter, AuthMiddleware, RoleGuard(['chef_service','controleur']), this.user.getUsers);
    this.router.get(`${this.path}/:id`, readRateLimiter, AuthMiddleware, RoleGuard(['chef_service','controleur']), this.user.getUserById);
    this.router.get(`${this.path}_me`, readRateLimiter, AuthMiddleware, this.user.getConnected);
    
    // Endpoint d'invitation - rate limiting restrictif
    this.router.post(
      `${this.path}`,
      inviteRateLimiter,
      AuthMiddleware,
      RoleGuard(['chef_service', 'controleur']),
      ValidationMiddleware(CreateInvitationDto),
      this.user.inviteUser,
    );
    
    // Endpoint de modification - rate limiting modéré
    this.router.patch(`${this.path}/:id`, writeRateLimiter, AuthMiddleware, RoleGuard(["chef_service","controleur"]), ValidationMiddleware(UpdateUserDto, true), this.user.updateUser);
    
    // Endpoint de suppression - rate limiting très restrictif
    this.router.delete(`${this.path}/:id`, deleteRateLimiter, AuthMiddleware, RoleGuard(["chef_service","controleur"]), this.user.deleteUser);
  }
}
