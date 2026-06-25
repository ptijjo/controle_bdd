import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../utils/bcrpt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureControleurSeeder();
  }

  /**
   * Si EMAIL_SEEDER / PASSWORD_SEEDER sont définis : crée un utilisateur
   * rôle controleur lorsque l’e-mail n’existe pas encore.
   */
  async ensureControleurSeeder(): Promise<void> {
    const email = process.env.EMAIL_SEEDER?.trim();
    const password = process.env.PASSWORD_SEEDER;

    if (!email || password === undefined || password === '') {
      this.logger.warn(
        'EMAIL_SEEDER ou PASSWORD_SEEDER absent — création du compte seeder ignorée.',
      );
      return;
    }

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      this.logger.log(`Compte seeder déjà présent (${email}), aucune action.`);
      return;
    }

    const hashed = await this.bcryptService.hashPassword(password);
    await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        nom: 'Controleur',
        prenom: 'Seeder',
        role: Role.controleur,
      },
    });
    this.logger.log(`Compte controleur seeder créé : ${email}`);
  }
}
