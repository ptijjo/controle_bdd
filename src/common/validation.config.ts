import { ValidationPipe, type ValidationPipeOptions } from '@nestjs/common';

/** Options alignées sur `02-context.mdc` (whitelist + rejet des champs inconnus). */
export const strictValidationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
};

export function createStrictValidationPipe(): ValidationPipe {
  return new ValidationPipe(strictValidationPipeOptions);
}
