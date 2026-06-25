import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'node:fs';
import * as path from 'node:path';
import type { AuthUser } from '../auth/types/auth-user.type';
import { CreateFormDto } from './dto/create-form.dto';
import { MailService } from '../mail/mail.service';
import { generatePdf } from '../utils/pdfCreator';
import { getControleDir, getControleExcelFilePath, saveFormToExcel } from '../utils/saveToExcel';
import { FormSecurityLoggerService } from './form-security-logger.service';
import { SecurityAction } from './security-action.enum';

const MAX_SIGNATURE_SIZE = 500 * 1024;

@Injectable()
export class FormulaireService {
  constructor(
    private readonly mailService: MailService,
    private readonly securityLogger: FormSecurityLoggerService,
  ) {}

  /**
   * Flux du fichier Excel agrégé (`controle/controle.xlsx`), ou 404 s’il n’existe pas encore.
   */
  getControleExcelExport(): StreamableFile {
    const filePath = path.normalize(path.resolve(getControleExcelFilePath()));
    const controleDir = path.normalize(path.resolve(getControleDir()));
    if (!filePath.startsWith(controleDir + path.sep)) {
      throw new NotFoundException('Chemin de fichier invalide.');
    }
    if (path.basename(filePath) !== 'controle.xlsx') {
      throw new NotFoundException('Chemin de fichier invalide.');
    }
    if (!existsSync(filePath)) {
      throw new NotFoundException(
        'Aucun fichier d’extraction pour le moment. Enregistrez au moins un formulaire pour générer le classeur.',
      );
    }
    const stream = createReadStream(filePath);
    return new StreamableFile(stream, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename="controle.xlsx"',
    });
  }

  async createForm(
    authUser: AuthUser,
    formData: CreateFormDto,
    ipAddress: string,
  ): Promise<{ envoiPdf: string; saveExcel: string }> {
    const user = authUser.nom;
    const userExcel = { nom: authUser.nom, prenom: authUser.prenom };

    if (!formData.carNonPasse) {
      if (!formData.controllerSignature || !formData.chauffeurSignature) {
        throw new BadRequestException(
          'Les deux signatures sont obligatoires lorsque le car est passé au contrôle',
        );
      }

      const validateSignature = (signature: string, name: string) => {
        const base64Data = signature.includes(',')
          ? signature.split(',')[1] ?? ''
          : signature;
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
          throw new BadRequestException(
            `Format de signature invalide pour ${name}`,
          );
        }
        const estimatedSize = (base64Data.length * 3) / 4;
        if (estimatedSize > MAX_SIGNATURE_SIZE) {
          throw new BadRequestException(
            `Signature ${name} trop volumineuse (max 500KB)`,
          );
        }
      };

      validateSignature(formData.controllerSignature, 'contrôleur');
      validateSignature(formData.chauffeurSignature, 'chauffeur');
    }

    const pdfBuffer = await generatePdf(user, formData);
    const pdfBuffer64 = pdfBuffer.toString('base64');

    const envoiPdf = await this.mailService.sendResume(formData, pdfBuffer64, [
      authUser.email,
    ]);
    const saveExcel = await saveFormToExcel(userExcel, formData);

    this.securityLogger.logFormAction(
      SecurityAction.FORM_CREATED,
      authUser,
      ipAddress,
      {
        lieuControle: formData.lieuControle,
        date: formData.date,
        client: formData.client,
      },
    );

    return { envoiPdf, saveExcel };
  }
}
