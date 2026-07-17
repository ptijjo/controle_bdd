import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { FormProcessingStatus } from '../generated/prisma/client.js';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { generatePdf } from '../utils/pdfCreator';
import { saveFormToExcel } from '../utils/saveToExcel';
import type { CreateFormDto } from './dto/create-form.dto';
import { FormSecurityLoggerService } from './form-security-logger.service';
import { SecurityAction } from './security-action.enum';

type AuthUserLite = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
};

/**
 * File séquentielle in-process : PDF + mail + Excel hors chemin HTTP critique.
 * Concurrence 1 pour éviter les races sur le fichier Excel.
 */
@Injectable()
export class FormProcessingQueue implements OnModuleDestroy {
  private readonly logger = new Logger(FormProcessingQueue.name);
  private readonly pending: string[] = [];
  private running = false;
  private destroyed = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly securityLogger: FormSecurityLoggerService,
  ) {}

  enqueue(submissionId: string): void {
    if (this.destroyed) return;
    this.pending.push(submissionId);
    void this.drain();
  }

  onModuleDestroy(): void {
    this.destroyed = true;
    this.pending.length = 0;
  }

  private async drain(): Promise<void> {
    if (this.running || this.destroyed) return;
    this.running = true;
    try {
      while (this.pending.length > 0 && !this.destroyed) {
        const id = this.pending.shift();
        if (id) {
          await this.processOne(id);
        }
      }
    } finally {
      this.running = false;
      if (this.pending.length > 0 && !this.destroyed) {
        void this.drain();
      }
    }
  }

  private async processOne(submissionId: string): Promise<void> {
    const row = await this.prisma.formSubmission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: { id: true, email: true, nom: true, prenom: true, role: true },
        },
      },
    });
    if (!row || row.processingStatus === FormProcessingStatus.completed) {
      return;
    }

    await this.prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        processingStatus: FormProcessingStatus.processing,
        processingError: null,
      },
    });

    try {
      const formData = row.payload as unknown as CreateFormDto;
      const authUser: AuthUserLite = {
        id: row.user.id,
        email: row.user.email,
        nom: row.user.nom,
        prenom: row.user.prenom,
      };

      const pdfBuffer = await generatePdf(authUser.nom, formData);
      const pdfBuffer64 = pdfBuffer.toString('base64');
      await this.mailService.sendResume(formData, pdfBuffer64, [
        authUser.email,
      ]);
      await saveFormToExcel(
        { nom: authUser.nom, prenom: authUser.prenom },
        formData,
      );

      this.securityLogger.logFormAction(
        SecurityAction.FORM_CREATED,
        authUser,
        row.ipAddress,
        {
          lieuControle: formData.lieuControle,
          date: formData.date,
          client: formData.client,
        },
      );

      await this.prisma.formSubmission.update({
        where: { id: submissionId },
        data: { processingStatus: FormProcessingStatus.completed },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Échec traitement formulaire';
      this.logger.error({
        msg: 'Échec traitement asynchrone formulaire',
        submissionId,
        error: message,
      });
      await this.prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
          processingStatus: FormProcessingStatus.failed,
          processingError: message.slice(0, 500),
        },
      });
    }
  }
}
