import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RoleGuard } from '@/middlewares/role.middleware';
import { CreateFormDto } from '@/dtos/forms.dto';
import { FormController } from '@/controllers/forms.controller';

export class FormRoute implements Routes {
  public path = '/forms';
  public router = Router();
  public form = new FormController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, RoleGuard(['chef_service']), this.form.getForms);
    this.router.get(`${this.path}/:id`, AuthMiddleware, RoleGuard(['chef_service']), this.form.getFormById);
    this.router.post(`${this.path}`, AuthMiddleware, RoleGuard(['chef_service','controleur']), ValidationMiddleware(CreateFormDto), this.form.createForm);
    // this.router.delete(`${this.path}/:id`,AuthMiddleware,RoleGuard(["chef_service"]),);
  }
}
