import { Role } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: Role;
}
