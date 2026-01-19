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
import { DownloadFile } from '@/services/file.service';
import path from 'path';
import { logger } from '@/utils/logger';
import { securityLogger, SecurityAction } from '@/utils/securityLogger';


export class FormController {
  public email = Container.get(MailService);
  public download = Container.get(DownloadFile);

  public createForm = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transformation du JSON en instance DTO
      const formData = plainToInstance(CreateFormDto, req.body);

      // Validation
      const errors = await validate(formData);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }

      const user = req.user.nom ;
      const userExcel = {
        nom: req.user.nom,
        prenom: req.user.prenom,
      };

      // Vérification signatures présentes
      if (!formData.controllerSignature || !formData.chauffeurSignature /*|| !formData.nom || !formData.prenom*/) {
        throw new HttpException(400, 'Les deux signatures et le nom du chauffeur sont obligatoires');
      }

      // Validation du format et de la taille des signatures base64
      const MAX_SIGNATURE_SIZE = 500 * 1024; // 500KB max par signature
      const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i;
      
      const validateSignature = (signature: string, name: string) => {
        // Vérifier le format base64 (avec ou sans préfixe data URL)
        const base64Data = signature.includes(',') ? signature.split(',')[1] : signature;
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
          throw new HttpException(400, `Format de signature invalide pour ${name}`);
        }
        
        // Vérifier la taille (approximative : base64 est ~33% plus grand que l'original)
        const estimatedSize = (base64Data.length * 3) / 4;
        if (estimatedSize > MAX_SIGNATURE_SIZE) {
          throw new HttpException(400, `Signature ${name} trop volumineuse (max 500KB)`);
        }
      };

      validateSignature(formData.controllerSignature, 'contrôleur');
      validateSignature(formData.chauffeurSignature, 'chauffeur');

      //Vérification si email present
      // if (!formData.email) {
      //   throw new HttpException(400, "L'email du chauffeur est obligatoire");
      // }

      const pdfBuffer = await generatePdf(user, formData);
      const pdfBuffer64 = pdfBuffer.toString('base64');

      //On envoi le form en pdf par mail au chef de secteur (et au chauffeur en Bcc si email fourni)
      const envoiPdf = await this.email.sendResume(formData, pdfBuffer64);

      const saveExcel = await saveFormToExcel(userExcel, formData);

      // Log de la création du formulaire
      const ipAddress = String(req.ip || 'unknown');
      securityLogger.logFormAction(
        SecurityAction.FORM_CREATED,
        req.user,
        ipAddress,
        {
          lieuControle: formData.lieuControle,
          date: formData.date,
          client: formData.client,
        }
      );

      res.status(201).json({ data: { envoiPdf, saveExcel }, message: 'Formulaire crée avec succès' });
    } catch (error) {
      next(error);
    }
  };

  public downloadFile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const filepath = await this.download.downloadFile();
      const ipAddress = String(req.ip || 'unknown');

      // Log du téléchargement
      securityLogger.logFormAction(
        SecurityAction.FILE_DOWNLOADED,
        req.user,
        ipAddress,
        {
          filename: path.basename(filepath),
          filepath,
        }
      );

      res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filepath)}`);
      res.download(filepath, err => {
        if (err) {
          logger.error('Erreur lors du téléchargement du fichier:', err);
          next(new HttpException(500, 'Erreur lors du téléchargement du fichier'));
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
