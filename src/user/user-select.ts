/** Champs utilisateur exposables (jamais le hash password). */
export const userPublicSelect = {
  id: true,
  email: true,
  nom: true,
  prenom: true,
  role: true,
  createdAt: true,
  failedLoginAttempts: true,
  lockedUntil: true,
  updatedAt: true,
} as const;
