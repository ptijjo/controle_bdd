jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

jest.mock('./form-processing.queue', () => ({
  FormProcessingQueue: class FormProcessingQueue {},
}));

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Readable } from 'node:stream';
import { Test, TestingModule } from '@nestjs/testing';
import type { AuthUser } from '../auth/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { toCreateFormDto } from '../test/helpers/to-create-form-dto';
import { createMockPrisma } from '../test/mocks/prisma.mock';
import * as saveToExcel from '../utils/saveToExcel';
import { FormProcessingQueue } from './form-processing.queue';
import { FormulaireService } from './formulaire.service';

const mockExistsSync = jest.fn();
const mockCreateReadStream = jest.fn();

jest.mock('node:fs', () => ({
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
  createReadStream: (...args: unknown[]) => mockCreateReadStream(...args),
}));

jest.mock('../utils/saveToExcel', () => ({
  getControleDir: jest.fn(),
  getControleExcelFilePath: jest.fn(),
  saveFormToExcel: jest.fn(),
}));

const mockGetControleDir = saveToExcel.getControleDir as jest.MockedFunction<
  typeof saveToExcel.getControleDir
>;
const mockGetControleExcelFilePath =
  saveToExcel.getControleExcelFilePath as jest.MockedFunction<
    typeof saveToExcel.getControleExcelFilePath
  >;

const authUser: AuthUser = {
  id: 'user-1',
  email: 'u@test.com',
  nom: 'Martin',
  prenom: 'Paul',
  role: 'agent',
  createdAt: new Date(),
  updatedAt: new Date(),
  failedLoginAttempts: 0,
  lockedUntil: null,
};

describe('FormulaireService', () => {
  let service: FormulaireService;
  const enqueue = jest.fn();
  const prisma = createMockPrisma();

  beforeEach(async () => {
    enqueue.mockReset();
    mockGetControleDir.mockReset();
    mockGetControleExcelFilePath.mockReset();
    mockExistsSync.mockReset();
    mockCreateReadStream.mockReset();
    prisma.formSubmission.create.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormulaireService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: FormProcessingQueue,
          useValue: { enqueue },
        },
      ],
    }).compile();

    service = module.get(FormulaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getControleExcelExport', () => {
    const controleDir = 'C:\\project\\controle';
    const excelPath = 'C:\\project\\controle\\controle.xlsx';

    beforeEach(() => {
      mockGetControleDir.mockReturnValue(controleDir);
      mockGetControleExcelFilePath.mockReturnValue(excelPath);
    });

    it('should throw NotFoundException when file path escapes controle directory', () => {
      mockGetControleExcelFilePath.mockReturnValue(
        'C:\\project\\autre\\controle.xlsx',
      );

      expect(() => service.getControleExcelExport()).toThrow(NotFoundException);
      expect(() => service.getControleExcelExport()).toThrow(
        'Chemin de fichier invalide.',
      );
    });

    it('should throw NotFoundException when basename is not controle.xlsx', () => {
      mockGetControleExcelFilePath.mockReturnValue(
        'C:\\project\\controle\\autre.xlsx',
      );

      expect(() => service.getControleExcelExport()).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when workbook file does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      expect(() => service.getControleExcelExport()).toThrow(NotFoundException);
      expect(() => service.getControleExcelExport()).toThrow(
        'Aucun fichier d’extraction pour le moment',
      );
    });

    it('should return StreamableFile when workbook exists', () => {
      mockExistsSync.mockReturnValue(true);
      const stream = Readable.from(['xlsx']);
      mockCreateReadStream.mockReturnValue(stream);

      const result = service.getControleExcelExport();

      expect(mockCreateReadStream).toHaveBeenCalledWith(excelPath);
      expect(result).toBeDefined();
      expect(result.options?.type).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
    });
  });

  describe('createForm', () => {
    it('should reject missing signatures when car passed control', async () => {
      const formData = toCreateFormDto({
        carNonPasse: false,
        heureReelle: '08:15',
      });

      await expect(
        service.createForm(authUser, formData, '10.0.0.1'),
      ).rejects.toThrow(
        'Les deux signatures sont obligatoires lorsque le car est passé au contrôle',
      );
    });

    it('should reject invalid signature format', async () => {
      const formData = toCreateFormDto({
        carNonPasse: false,
        heureReelle: '08:15',
        controllerSignature: '!!!invalid!!!',
        chauffeurSignature: 'YWJj',
      });

      await expect(
        service.createForm(authUser, formData, '10.0.0.1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject oversized signature', async () => {
      const hugeBase64 = 'A'.repeat(700_000);
      const formData = toCreateFormDto({
        carNonPasse: false,
        heureReelle: '08:15',
        controllerSignature: hugeBase64,
        chauffeurSignature: 'YWJj',
      });

      await expect(
        service.createForm(authUser, formData, '10.0.0.1'),
      ).rejects.toThrow('Signature contrôleur trop volumineuse (max 500KB)');
    });

    it('should persist submission and enqueue background processing', async () => {
      const formData = toCreateFormDto({
        carNonPasse: false,
        heureReelle: '08:15',
        controllerSignature: 'YWJj',
        chauffeurSignature: 'YWJj',
      });
      prisma.formSubmission.create.mockResolvedValue({ id: 'sub-1' });

      const result = await service.createForm(authUser, formData, '192.168.1.5');

      expect(prisma.formSubmission.create).toHaveBeenCalled();
      expect(enqueue).toHaveBeenCalledWith('sub-1');
      expect(result).toEqual({ id: 'sub-1', status: 'accepted' });
    });

    it('should skip signatures when car did not pass control', async () => {
      const formData = toCreateFormDto({ carNonPasse: true });
      prisma.formSubmission.create.mockResolvedValue({ id: 'sub-2' });

      const result = await service.createForm(authUser, formData, '127.0.0.1');

      expect(result).toEqual({ id: 'sub-2', status: 'accepted' });
      expect(enqueue).toHaveBeenCalledWith('sub-2');
    });
  });
});
