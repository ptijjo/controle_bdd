/** Contenu du refresh JWT : utilisateur + jti pour révocation. */
export type RefreshJwtPayload = {
  sub: string;
  jti: string;
};
