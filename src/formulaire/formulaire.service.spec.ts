import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Readable } from 'node:stream';
import { Test, TestingModule } from '@nestjs/testing';
import type { AuthUser } from '../auth/types/auth-user.type';
import { toCreateFormDto } from '../test/helpers/to-create-form-dto';
import { MailService } from '../mail/mail.service';
import { generatePdf } from '../utils/pdfCreator';
import * as saveToExcel from '../utils/saveToExcel';
import { FormSecurityLoggerService } from './form-security-logger.service';
import { FormulaireService } from './formulaire.service';
import { SecurityAction } from './security-action.enum';

const mockExistsSync = jest.fn();
const mockCreateReadStream = jest.fn();

jest.mock('node:fs', () => ({
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
  createReadStream: (...args: unknown[]) => mockCreateReadStream(...args),
}));

jest.mock('../utils/pdfCreator', () => ({
  generatePdf: jest.fn(),
}));

jest.mock('../utils/saveToExcel', () => ({
  getControleDir: jest.fn(),
  getControleExcelFilePath: jest.fn(),
  saveFormToExcel: jest.fn(),
}));

const mockGeneratePdf = generatePdf as jest.MockedFunction<typeof generatePdf>;
const mockGetControleDir = saveToExcel.getControleDir as jest.MockedFunction<
  typeof saveToExcel.getControleDir
>;
const mockGetControleExcelFilePath =
  saveToExcel.getControleExcelFilePath as jest.MockedFunction<
    typeof saveToExcel.getControleExcelFilePath
  >;
const mockSaveFormToExcel = saveToExcel.saveFormToExcel as jest.MockedFunction<
  typeof saveToExcel.saveFormToExcel
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
  const sendResume = jest.fn();
  const logFormAction = jest.fn();

  beforeEach(async () => {
    sendResume.mockReset();
    logFormAction.mockReset();
    mockGeneratePdf.mockReset();
    mockGetControleDir.mockReset();
    mockGetControleExcelFilePath.mockReset();
    mockSaveFormToExcel.mockReset();
    mockExistsSync.mockReset();
    mockCreateReadStream.mockReset();

    mockGeneratePdf.mockResolvedValue(Buffer.from('pdf-bytes'));
    sendResume.mockResolvedValue('email-envoye');
    mockSaveFormToExcel.mockResolvedValue('excel-enregistre');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormulaireService,
        {
          provide: MailService,
          useValue: { sendResume },
        },
        {
          provide: FormSecurityLoggerService,
          useValue: { logFormAction },
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
      ).rejects.toThrow('Format de signature invalide pour contrôleur');
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

    it('should generate PDF, send email, save Excel and log security action on success', async () => {
      const formData = toCreateFormDto({
        carNonPasse: false,
        heureReelle: '08:15',
        controllerSignature: 'YWJj',
        chauffeurSignature: 'YWJj',
      });

      const result = await service.createForm(authUser, formData, '192.168.1.5');

      expect(mockGeneratePdf).toHaveBeenCalledWith(
        authUser.nom,
        expect.objectContaining({
          client: 'casas',
          lieuControle: 'Gare',
        }),
      );
      expect(sendResume).toHaveBeenCalledWith(
        expect.objectContaining({ client: 'casas' }),
        expect.any(String),
        [authUser.email],
      );
      expect(mockSaveFormToExcel).toHaveBeenCalledWith(
        { nom: authUser.nom, prenom: authUser.prenom },
        expect.objectContaining({ client: 'casas' }),
      );
      expect(logFormAction).toHaveBeenCalledWith(
        SecurityAction.FORM_CREATED,
        authUser,
        '192.168.1.5',
        expect.objectContaining({
          lieuControle: 'Gare',
          client: 'casas',
        }),
      );
      expect(result).toEqual({
        envoiPdf: 'email-envoye',
        saveExcel: 'excel-enregistre',
      });
    });

    it('should skip signatures when car did not pass control', async () => {
      const formData = toCreateFormDto({ carNonPasse: true });

      const result = await service.createForm(authUser, formData, '127.0.0.1');

      expect(result.envoiPdf).toBe('email-envoye');
      expect(mockGeneratePdf).toHaveBeenCalled();
      expect(logFormAction).toHaveBeenCalled();
    });
  });
});
