import { Role } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: Role;
  failedLoginAttempts: number;
  lockedUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** Utilisateur exposé aux API (jamais le hash mot de passe). */
export type PublicUser = Omit<User, 'password'>;
