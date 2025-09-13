import { SignatureType } from "@prisma/client";

export interface Signature {
  id: string;
  formId: string;
  controleurId?: string;
  signataireNom?: string;
  base64: string;
  type:SignatureType,
  createdAt: Date;
}
