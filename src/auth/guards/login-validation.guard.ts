import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AuthDto } from '../dto/auth.dto';

/** Valide le corps de la requête avant Passport Local (les pipes s’exécutent après les guards). */
@Injectable()
export class LoginValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const body = context.switchToHttp().getRequest().body as unknown;
    const dto = plainToInstance(AuthDto, body);
    const errors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return true;
  }
}
