import { Injectable, Logger } from '@nestjs/common';
import type { AuthUser } from '../auth/types/auth-user.type';
import { SecurityAction } from './security-action.enum';

@Injectable()
export class FormSecurityLoggerService {
  private readonly logger = new Logger(FormSecurityLoggerService.name);

  logFormAction(
    action: SecurityAction,
    user: AuthUser,
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
