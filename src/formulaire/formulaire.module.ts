import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { FormSecurityLoggerService } from './form-security-logger.service';
import { FormulaireController } from './formulaire.controller';
import { FormulaireService } from './formulaire.service';
@Module({
  imports: [AuthModule, MailModule],
  controllers: [FormulaireController],
  providers: [FormulaireService, FormSecurityLoggerService],
})
export class FormulaireModule {}
