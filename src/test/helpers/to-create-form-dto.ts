import { plainToInstance } from 'class-transformer';
import { CreateFormDto } from '../../formulaire/dto/create-form.dto';
import { validFormBody } from './valid-form-body';

/** Corps formulaire typé pour les tests unitaires du service (validation faite en amont par le pipe HTTP). */
export function toCreateFormDto(
  overrides: Record<string, unknown> = {},
): CreateFormDto {
  return plainToInstance(CreateFormDto, validFormBody(overrides));
}
