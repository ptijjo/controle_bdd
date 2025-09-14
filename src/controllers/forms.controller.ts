import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { CreateInvitationDto } from '@/dtos/users.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Role, SignatureType } from '@prisma/client';
import { HttpException } from '@/exceptions/httpException';
import { FormService } from '@/services/forms.service';
import { Form } from '@/interfaces/forms.interface';
import { CreateFormDto } from '@/dtos/forms.dto';
import { CreateSignatureDto } from '@/dtos/signatures.dto';
import { SignatureService } from '@/services/signatures.service';

export class FormController {
  public form = Container.get(FormService);
  public signature = Container.get(SignatureService);

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
      const formData: CreateFormDto = req.body;
      const userId = req.user.id;

      // Vérification signatures présentes
      if (!req.body.controllerSignature || !req.body.chauffeurSignature || !req.body.chauffeurName) {
        throw new HttpException(400, "Les deux signatures et le nom du chauffeur sont obligatoires");
      }

      //Creation du formulaire
      const newForm: Form = await this.form.createForm(userId, formData);

      // Signature du contrôleur
      const controllerSignatureDto: CreateSignatureDto = {
        base64: req.body.controllerSignature,
        type: SignatureType.controleur,
      };
      await this.signature.createSignature(newForm.id as string, controllerSignatureDto, undefined, userId);

      // Signature du voyageur
      const chauffeurSignatureDto: CreateSignatureDto = {
        base64: req.body.chauffeurSignature,
        type: SignatureType.chauffeur,
      };
      await this.signature.createSignature(newForm.id as string, chauffeurSignatureDto, req.body.chauffeurName);

      // Vérifier si le formulaire est complet
      const isComplete = await this.form.isFormComplete(newForm.id as string);

      if (!isComplete) {
        throw new HttpException(400, "Le formulaire n'est pas encore complètement signé");
      }

      //On envoi le form en pdf par mail si tout est complet

      res.status(201).json({ data: { newForm, isComplete }, message: 'Formulaire crée avec succès' });
    } catch (error) {
      next(error);
    }
  };

  public deleteForm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const formId = String(req.params.id);
      const deleteFormData: Form = await this.form.deleteForm(formId);

      res.status(200).json({ data: deleteFormData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
