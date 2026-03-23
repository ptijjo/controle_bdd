import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateInvitationDto, CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { PublicUser } from '@interfaces/users.interface';
import jwt from 'jsonwebtoken';
import { FRONT_END, SECRET_KEY_INVITATION } from '@/config';
import { JWT_ALGORITHM } from '@/constants/jwt';
import { sendMailActivation } from '../mails/users/user.email';
import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';

@Service()
export class UserService {
  public user = prisma.user;

  public async findAllUser(): Promise<PublicUser[]> {
    return this.user.findMany({ omit: { password: true } });
  }

  public async findUserById(userId: string): Promise<PublicUser> {
    const findUser = await this.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async invitationUser(invitationData: CreateInvitationDto): Promise<void> {
    const existing = await this.user.findUnique({ where: { email: invitationData.email }, select: { id: true } });
    if (existing) {
      throw new HttpException(409, "Impossible d'envoyer une invitation vers cette adresse.");
    }

    const tokenInvitation = jwt.sign(
      { email: invitationData.email },
      SECRET_KEY_INVITATION as string,
      { expiresIn: '24h', algorithm: JWT_ALGORITHM },
    );

    const link = `${FRONT_END}/${tokenInvitation}`;
    await sendMailActivation(invitationData.email, link);
    
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<PublicUser> {
    const findUser = await this.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const { password, ...rest } = userData;
    const data: Prisma.UserUpdateInput = { ...rest };
    if (password != null && String(password).trim() !== '') {
      data.password = await hash(password, 10);
    }

    return this.user.update({
      where: { id: userId },
      data,
      omit: { password: true },
    });
  }

  public async deleteUser(userId: string): Promise<PublicUser> {
    const findUser = await this.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return this.user.delete({ where: { id: userId }, omit: { password: true } });
  }

}
