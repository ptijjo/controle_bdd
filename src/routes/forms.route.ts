import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RoleGuard } from '@/middlewares/role.middleware';
import { CreateFormDto } from '@/dtos/forms.dto';
import { FormController } from '@/controllers/forms.controller';
import { writeRateLimiter, downloadRateLimiter } from '@/middlewares/rateLimit.middleware';

export class FormRoute implements Routes {
  public path = '/forms';
  public router = Router();
  public form = new FormController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Création de formulaire - rate limiting modéré
    this.router.post(`${this.path}`, writeRateLimiter, AuthMiddleware, RoleGuard(['chef_service','controleur']), ValidationMiddleware(CreateFormDto), this.form.createForm);
    
    // Téléchargement de fichier Excel - rate limiting spécifique
    this.router.get(`${this.path}`, downloadRateLimiter, AuthMiddleware, RoleGuard(['chef_service','controleur']), this.form.downloadFile);
  }
}
