import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FormProcessingQueue } from './form-processing.queue';
import { FormSecurityLoggerService } from './form-security-logger.service';
import { FormulaireController } from './formulaire.controller';
import { FormulaireService } from './formulaire.service';

@Module({
  imports: [AuthModule, MailModule, PrismaModule],
  controllers: [FormulaireController],
  providers: [
    FormulaireService,
    FormSecurityLoggerService,
    FormProcessingQueue,
  ],
})
export class FormulaireModule {}
