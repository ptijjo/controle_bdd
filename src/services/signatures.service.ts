import { PrismaClient, SignatureType } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';

import { Form } from '@/interfaces/forms.interface';
import { CreateFormDto } from '@/dtos/forms.dto';
import { Signature } from '@/interfaces/signatures.interface';
import { CreateSignatureDto } from '@/dtos/signatures.dto';

@Service()
export class FormService {
  public signature = new PrismaClient().signature;

  public async findAllSignature(): Promise<Signature[]> {
    const allSignature: Signature[] = await this.signature.findMany();
    return allSignature;
  }

  public async findSignatureById(formId: string): Promise<Signature> {
    const findSignature: Signature = await this.signature.findUnique({ where: { id: formId } });
    if (!findSignature) throw new HttpException(409, "User doesn't exist");

    return findSignature;
  }

  public async createSignature(formId: string, formData: CreateSignatureDto, signataire?: string, userId?: string): Promise<Signature> {
    // Vérifier si une signature de ce type existe déjà pour ce form
    const existing = await this.signature.findFirst({
      where: { formId, type: formData.type },
    });
    if (existing) {
      throw new Error(`Une signature de type ${formData.type} existe déjà pour ce formulaire`);
    }


    const newSignature: Signature = await this.signature.create({
      data: {
        ...formData,
        form: { connect: { id: formId } },
        controleur: formData.type === SignatureType.controleur && userId
          ? { connect: { id: userId } }
          : undefined,
        signataireNom: formData.type === SignatureType.chauffeur ? signataire : undefined,
      },
    });

    return newSignature;
  }

  public async deleteUser(formId: string): Promise<Signature> {
    const findSignature: Signature = await this.signature.findUnique({ where: { id: formId } });
    if (!findSignature) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.signature.delete({ where: { id: formId } });
    return deleteUserData;
  }
}
