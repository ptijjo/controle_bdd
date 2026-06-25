import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../utils/bcrpt';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  /**
   * Find one user by email
   * @param email - The email of the user to find
   * @returns The user found or null if not found
   */
  public async findOneUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find one user by id
   */
  public async findOneUserById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Utilisateur sans mot de passe (ex. après validation JWT)
   */
  public async findSafeUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.findOneUserById(id);
    if (!user) {
      return null;
    }
    const { password, ...safe } = user;
    void password;
    return safe;
  }

  /** Liste tous les utilisateurs (sans mot de passe). */
  public async getAllUser(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => {
      const { password, ...rest } = u;
      void password;
      return rest;
    });
  }

  /** Détail d’un utilisateur par id (sans mot de passe). */
  public async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.findOneUserById(id);
    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} introuvable`);
    }
    const { password, ...rest } = user;
    void password;
    return rest;
  }

  /** Mise à jour partielle ; au moins un champ requis. */
  public async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
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

    const updated = await this.prisma.user.update({
      where: { id },
      data: updatePayload,
    });
    const { password, ...rest } = updated;
    void password;
    return rest;
  }

  /** Supprime un utilisateur par id. */
  public async deleteUser(id: string): Promise<void> {
    const existing = await this.findOneUserById(id);
    if (!existing) {
      throw new NotFoundException(`Utilisateur ${id} introuvable`);
    }
    await this.prisma.user.delete({ where: { id } });
  }
}
