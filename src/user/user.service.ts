import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../utils/bcrpt';
import type { UpdateUserDto } from './dto/update-user.dto';
import { userPublicSelect } from './user-select';

export type PublicUserRow = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  public async findOneUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  public async findOneUserById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  public async findSafeUserById(id: string): Promise<PublicUserRow | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }

  /** Liste paginée des utilisateurs (sans mot de passe). */
  public async getAllUser(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: PublicUserRow[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.min(100, Math.max(1, params?.limit ?? 50));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        select: userPublicSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return { items, total, page, limit };
  }

  public async getUserById(id: string): Promise<PublicUserRow> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} introuvable`);
    }
    return user;
  }

  public async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<PublicUserRow> {
    const existing = await this.findOneUserById(id);
    if (!existing) {
      throw new NotFoundException(`Utilisateur ${id} introuvable`);
    }

    const hasField =
      data.email !== undefined ||
      data.password !== undefined ||
      data.nom !== undefined ||
      data.prenom !== undefined ||
      data.role !== undefined;
    if (!hasField) {
      throw new BadRequestException('Aucun champ à mettre à jour.');
    }

    const updatePayload: {
      email?: string;
      nom?: string;
      prenom?: string;
      role?: User['role'];
      password?: string;
    } = {};

    if (data.email !== undefined) {
      updatePayload.email = data.email;
    }
    if (data.nom !== undefined) {
      updatePayload.nom = data.nom;
    }
    if (data.prenom !== undefined) {
      updatePayload.prenom = data.prenom;
    }
    if (data.role !== undefined) {
      updatePayload.role = data.role;
    }
    if (data.password !== undefined) {
      updatePayload.password = await this.bcryptService.hashPassword(
        data.password,
      );
    }

    return await this.prisma.user.update({
      where: { id },
      data: updatePayload,
      select: userPublicSelect,
    });
  }

  public async deleteUser(id: string): Promise<void> {
    const existing = await this.findOneUserById(id);
    if (!existing) {
      throw new NotFoundException(`Utilisateur ${id} introuvable`);
    }
    await this.prisma.user.delete({ where: { id } });
  }
}
