import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { Form } from '@/interfaces/forms.interface';
import { CreateFormDto } from '@/dtos/forms.dto';

@Service()
export class FormService {
  public form = new PrismaClient().form;

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

   return newForm
  }

  public async deleteUser(formId: string): Promise<Form> {
    const findForm: Form = await this.form.findUnique({ where: { id: formId } });
    if (!findForm) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.form.delete({ where: { id: formId } });
    return deleteUserData;
  }

}
