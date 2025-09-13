import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { CreateInvitationDto } from '@/dtos/users.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Role } from '@prisma/client';
import { HttpException } from '@/exceptions/httpException';
import { FormService } from '@/services/forms.service';
import { Form } from '@/interfaces/forms.interface';
import { CreateFormDto } from '@/dtos/forms.dto';


export class FormController {
  public form = Container.get(FormService);
 
  
  public getForms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllFormData: Form[] = await this.form.findAllForm();

      res.status(200).json({ data: findAllFormData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getFormById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const formId = String(req.params.id);
      const findOneFormData: Form = await this.form.findFormById(formId);

      res.status(200).json({ data: findOneFormData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createForm = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userData: CreateFormDto = req.body;
        const userId = req.user.id;
      const createFormData: Form = await this.form.createForm(userId,userData);

      res.status(201).json({ data: createFormData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };


  public deleteForm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const formId = String(req.params.id);
      const deleteFormData: Form = await this.form.deleteUser(formId);

      res.status(200).json({ data: deleteFormData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
