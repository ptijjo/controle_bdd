import { Injectable, Logger } from '@nestjs/common';
import { SecurityAction } from './security-action.enum';

type FormActor = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
};

@Injectable()
export class FormSecurityLoggerService {
  private readonly logger = new Logger(FormSecurityLoggerService.name);

  logFormAction(
    action: SecurityAction,
    user: FormActor,
    ipAddress: string,
    meta: {
      lieuControle: string;
      date: Date;
      client: string;
    },
  ): void {
    this.logger.log({
      action,
      userId: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      ipAddress,
      ...meta,
      date:
        meta.date instanceof Date
          ? meta.date.toISOString()
          : String(meta.date),
    });
  }
}
