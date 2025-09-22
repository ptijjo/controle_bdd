import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/httpException';
import { CreateFormDto } from '@/dtos/forms.dto';
import generatePdf from '@/utils/pdfCreator';
import { MailService } from '@/services/mails.service';
import { saveFormToExcel } from '@/utils/saveToExcel';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class FormController {
  public email = Container.get(MailService);

  public createForm = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
    
      // Transformation du JSON en instance DTO
      const formData = plainToInstance(CreateFormDto, req.body);

      // Validation
      const errors = await validate(formData);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
      }

      const user = req.user.nom + ' ' + req.user.prenom;
      const userExcel = {
        nom: req.user.nom,
        prenom: req.user.prenom,
      };

      // Vérification signatures présentes
      if (!formData.controllerSignature || !formData.chauffeurSignature || !formData.nom || !formData.prenom) {
        throw new HttpException(400, 'Les deux signatures et le nom du chauffeur sont obligatoires');
      }

      //Vérification si email present
      if (!formData.email) {
        throw new HttpException(400, "L'email du chauffeur est obligatoire");
      }

      const pdfBuffer = await generatePdf(user, formData);
      const pdfBuffer64 = pdfBuffer.toString('base64');

      //On envoi le form en pdf par mail si tout est complet

      const envoiPdf = await this.email.sendResume(formData.email, pdfBuffer64);

      const saveExcel = await saveFormToExcel(userExcel, formData);

      res.status(201).json({ data: { envoiPdf, saveExcel }, message: 'Formulaire crée avec succès' });
    } catch (error) {
      next(error);
    }
  };
}
