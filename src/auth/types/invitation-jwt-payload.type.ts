/** Contenu du JWT d’invitation (e-mail + identifiant unique à usage unique). */
export type InvitationJwtPayload = {
  email: string;
  jti: string;
};
