import { PrismaClient, SignatureType } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { Form } from '@/interfaces/forms.interface';
import { CreateFormDto } from '@/dtos/forms.dto';

@Service()
export class FormService {
  public form = new PrismaClient().form;
  public signature = new PrismaClient().signature;

  public async findAllForm(): Promise<Form[]> {
    const allForm: Form[] = await this.form.findMany();
    return allForm;
  }

  public async findFormById(formId: string): Promise<Form> {
    const findForm: Form = await this.form.findUnique({ where: { id: formId } });
    if (!findForm) throw new HttpException(409, "User doesn't exist");

    return findForm;
  }

  public async createForm(userId: string, formData: CreateFormDto): Promise<Form> {
    const newForm: Form = await this.form.create({
      data: {
        ...formData,
        controleur: { connect: { id: userId } }, // realtion entre user et form
      },
    });

    return newForm;
  }

  // Vérifier que le formulaire est complet (2 signatures)
  public async isFormComplete(formId: string): Promise<boolean> {
    const signatures = await this.signature.findMany({
      where: { formId },
      select: { type: true },
    });

    const hasController = signatures.some(sig => sig.type === SignatureType.controleur);
    const hasChauffeur = signatures.some(sig => sig.type === SignatureType.chauffeur);

    return hasController && hasChauffeur;
  }

  public async deleteForm(formId: string): Promise<Form> {
    const findForm: Form = await this.form.findUnique({ where: { id: formId } });
    if (!findForm) throw new HttpException(409, "Form doesn't exist");

    const deleteFormData = await this.form.delete({ where: { id: formId } });
    return deleteFormData;
  }
}
