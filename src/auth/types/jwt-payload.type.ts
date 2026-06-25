/** Contenu minimal de l’access JWT : identifiant utilisateur uniquement. */
export type JwtPayload = {
  sub: string;
};
