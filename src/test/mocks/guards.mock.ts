import type { CanActivate } from '@nestjs/common';

/** Guard de test qui autorise toutes les requêtes. */
export const allowAllGuard: CanActivate = {
  canActivate: () => true,
};

export function createAllowAllGuard(): CanActivate {
  return { canActivate: () => true };
}
