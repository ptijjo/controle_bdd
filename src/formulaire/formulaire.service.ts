import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'node:fs';
import * as path from 'node:path';
import type { AuthUser } from '../auth/types/auth-user.type';
import { Prisma } from '../generated/prisma/client.js';
import { CreateFormDto } from './dto/create-form.dto';
import { FormProcessingQueue } from './form-processing.queue';
import { PrismaService } from '../prisma/prisma.service';
import { getControleDir, getControleExcelFilePath } from '../utils/saveToExcel';

const MAX_SIGNATURE_SIZE = 500 * 1024;

@Injectable()
export class FormulaireService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly formQueue: FormProcessingQueue,
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
  ): Promise<{ id: string; status: string }> {
    if (!formData.carNonPasse) {
      if (!formData.controllerSignature || !formData.chauffeurSignature) {
        throw new BadRequestException(
          'Les deux signatures sont obligatoires lorsque le car est passé au contrôle',
        );
      }

      this.validateSignature(formData.controllerSignature, 'contrôleur');
      this.validateSignature(formData.chauffeurSignature, 'chauffeur');
    }

    const submission = await this.prisma.formSubmission.create({
      data: {
        userId: authUser.id,
        payload: formData as unknown as Prisma.InputJsonValue,
        ipAddress,
      },
    });

    this.formQueue.enqueue(submission.id);

    return { id: submission.id, status: 'accepted' };
  }

  private validateSignature(signature: string, name: string): void {
    const base64Data = signature.includes(',')
      ? (signature.split(',')[1] ?? '')
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
  }
}
