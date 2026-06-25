import type { User } from '../../generated/prisma/client.js';

/** Utilisateur authentifié (sans hash mot de passe) */
export type AuthUser = Omit<User, 'password'>;

/** Réponse publique (sans mot de passe) — alias d’AuthUser */
export type PublicUser = AuthUser;
