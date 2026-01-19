import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateInvitationDto, CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import jwt from 'jsonwebtoken';
import { FRONT_END, SECRET_KEY_INVITATION } from '@/config';
import { sendMailActivation } from '../mails/users/user.email';
import prisma from '@/utils/prisma';

@Service()
export class UserService {
  public user = prisma.user;

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.user.findMany();
    return allUser;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async invitationUser(invitationData: CreateInvitationDto): Promise<string> {
    const findUser: User = await this.user.findUnique({ where: { email: invitationData.email } });
    if (findUser) throw new HttpException(409, `This email ${invitationData.email} already exists`);


    //Creation du token
    const tokenInvitation = jwt.sign(
      {
        email: invitationData.email,

      },
      SECRET_KEY_INVITATION as string,
      { expiresIn: '24h' },
    );

    //sendEmail
    const link = `${FRONT_END}/${tokenInvitation}`;
    await sendMailActivation(invitationData.email, link);

    return link;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    const updateUserData = await this.user.update({ where: { id: userId }, data: { ...userData, password: hashedPassword } });
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.user.delete({ where: { id: userId } });
    return deleteUserData;
  }

}
