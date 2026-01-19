import rateLimit from 'express-rate-limit';

// Rate limiter pour l'authentification (login/signup)
export const authRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 15, // max 15 requêtes par IP
  message: 'Trop de tentatives de connexion, réessayez plus tard',
  skipSuccessfulRequests: false, // compte les requêtes réussies
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour les endpoints de lecture (GET) - plus permissif
export const readRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par IP
  message: 'Trop de requêtes de lecture, réessayez plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour les endpoints d'écriture (POST/PUT) - plus restrictif
export const writeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 requêtes par IP
  message: 'Trop de requêtes de modification, réessayez plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour les endpoints de suppression (DELETE) - très restrictif
export const deleteRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // max 10 suppressions par IP
  message: 'Trop de tentatives de suppression, réessayez plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour le téléchargement de fichiers - modéré
export const downloadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 téléchargements par IP
  message: 'Trop de tentatives de téléchargement, réessayez plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour les invitations d'utilisateurs - restrictif
export const inviteRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5, // max 5 invitations par IP
  message: 'Trop d\'invitations envoyées, réessayez plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});