import {
  ClassSerializerInterceptor,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createStrictValidationPipe } from './validation.config.js';

/** Pipes et intercepteurs HTTP partagés (prod, e2e, tests d’intégration). */
export function configureHttpApp(app: INestApplication): void {
  const reflector = app.get(Reflector);
  app.useGlobalPipes(createStrictValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
}

/** Alias explicite pour les tests qui n’ont besoin que du ValidationPipe. */
export function createStrictValidationPipeForTests(): ValidationPipe {
  return createStrictValidationPipe();
}
