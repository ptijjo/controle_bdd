/** Contenu minimal du refresh JWT : identifiant utilisateur uniquement. */
export type RefreshJwtPayload = {
  sub: string;
};
