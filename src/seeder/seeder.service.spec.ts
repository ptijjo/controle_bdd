import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../utils/bcrpt';
import { SeederService } from './seeder.service';

describe('SeederService', () => {
  let service: SeederService;
  const findUnique = jest.fn();
  const create = jest.fn();
  const hashPassword = jest.fn();

  beforeEach(async () => {
    findUnique.mockReset();
    create.mockReset();
    hashPassword.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique, create },
          },
        },
        {
          provide: BcryptService,
          useValue: { hashPassword },
        },
      ],
    }).compile();

    service = module.get(SeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('onModuleInit should call ensureControleurSeeder', async () => {
    const spy = jest
      .spyOn(service, 'ensureControleurSeeder')
      .mockResolvedValue(undefined);

    await service.onModuleInit();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  describe('ensureControleurSeeder', () => {
    const originalEmail = process.env.EMAIL_SEEDER;
    const originalPassword = process.env.PASSWORD_SEEDER;

    afterEach(() => {
      process.env.EMAIL_SEEDER = originalEmail;
      process.env.PASSWORD_SEEDER = originalPassword;
    });

    it('ne fait rien si EMAIL_SEEDER est absent', async () => {
      delete process.env.EMAIL_SEEDER;
      process.env.PASSWORD_SEEDER = 'secret';

      await service.ensureControleurSeeder();

      expect(findUnique).not.toHaveBeenCalled();
    });

    it('ne fait rien si PASSWORD_SEEDER est absent ou vide', async () => {
      process.env.EMAIL_SEEDER = 'a@b.c';
      delete process.env.PASSWORD_SEEDER;

      await service.ensureControleurSeeder();

      expect(findUnique).not.toHaveBeenCalled();

      process.env.PASSWORD_SEEDER = '';

      await service.ensureControleurSeeder();

      expect(findUnique).not.toHaveBeenCalled();
    });

    it('retourne sans créer si l’email existe déjà', async () => {
      process.env.EMAIL_SEEDER = 'exists@test.fr';
      process.env.PASSWORD_SEEDER = 'Aa1!aaaa';
      findUnique.mockResolvedValue({ id: '1', email: 'exists@test.fr' });

      await service.ensureControleurSeeder();

      expect(findUnique).toHaveBeenCalledWith({
        where: { email: 'exists@test.fr' },
      });
      expect(hashPassword).not.toHaveBeenCalled();
      expect(create).not.toHaveBeenCalled();
    });

    it('crée l’utilisateur controleur avec mot de passe hashé', async () => {
      process.env.EMAIL_SEEDER = '  new@seed.fr  ';
      process.env.PASSWORD_SEEDER = 'PlainPwd1!';
      findUnique.mockResolvedValue(null);
      hashPassword.mockResolvedValue('hashed-bcrypt');

      await service.ensureControleurSeeder();

      expect(hashPassword).toHaveBeenCalledWith('PlainPwd1!');
      expect(create).toHaveBeenCalledWith({
        data: {
          email: 'new@seed.fr',
          password: 'hashed-bcrypt',
          nom: 'Controleur',
          prenom: 'Seeder',
          role: Role.controleur,
        },
      });
    });
  });
});
