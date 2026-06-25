jest.mock('../utils/pdfCreator', () => ({
  generatePdf: jest.fn(),
}));

jest.mock('../utils/saveToExcel', () => ({
  saveFormToExcel: jest.fn(),
  getControleExcelFilePath: jest.fn(),
  getControleDir: jest.fn(),
}));

import { StreamableFile } from '@nestjs/common';
import { Readable } from 'node:stream';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { Role } from '../generated/prisma/client.js';
import { createAllowAllGuard } from '../test/mocks/guards.mock';
import { toCreateFormDto } from '../test/helpers/to-create-form-dto';
import { FormulaireController } from './formulaire.controller';
import { FormulaireService } from './formulaire.service';

type RequestWithUser = Request & { user: AuthUser };

function mockAuthUser(): AuthUser {
  return {
    id: '1',
    email: 'j@d.fr',
    nom: 'D',
    prenom: 'J',
    role: Role.controleur,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    failedLoginAttempts: 0,
    lockedUntil: null,
  };
}

function mockRequest(
  overrides: {
    headers?: Request['headers'];
    remoteAddress?: string;
  } = {},
): RequestWithUser {
  return {
    user: mockAuthUser(),
    headers: overrides.headers ?? {},
    socket: {
      remoteAddress: overrides.remoteAddress ?? '127.0.0.1',
    } as Request['socket'],
  } as RequestWithUser;
}

describe('FormulaireController', () => {
  let controller: FormulaireController;
  const createForm = jest.fn();
  const getControleExcelExport = jest.fn();

  beforeEach(async () => {
    createForm.mockReset();
    getControleExcelExport.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormulaireController],
      providers: [
        {
          provide: FormulaireService,
          useValue: { createForm, getControleExcelExport },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(createAllowAllGuard())
      .compile();

    controller = module.get(FormulaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should return 201 payload shape', async () => {
    createForm.mockResolvedValue({
      envoiPdf: 'success',
      saveExcel: 'enregistré',
    });
    const req = mockRequest();
    const user = req.user;
    const body = toCreateFormDto({ client: 'casas' });

    const result = await controller.create(req, body);

    expect(createForm).toHaveBeenCalledWith(user, body, '127.0.0.1');
    expect(result.message).toBe('Formulaire crée avec succès');
    expect(result.data).toEqual({
      envoiPdf: 'success',
      saveExcel: 'enregistré',
    });
  });

  it('create should resolve client IP from x-forwarded-for', async () => {
    createForm.mockResolvedValue({ envoiPdf: 'ok', saveExcel: 'ok' });
    const req = mockRequest({
      headers: { 'x-forwarded-for': '198.51.100.1, 10.0.0.2' },
      remoteAddress: '10.0.0.2',
    });
    const user = req.user;
    const body = toCreateFormDto();

    await controller.create(req, body);

    expect(createForm).toHaveBeenCalledWith(user, body, '198.51.100.1');
  });

  it('create should resolve client IP from x-real-ip', async () => {
    createForm.mockResolvedValue({ envoiPdf: 'ok', saveExcel: 'ok' });
    const req = mockRequest({
      headers: { 'x-real-ip': '203.0.113.5' },
      remoteAddress: '127.0.0.1',
    });
    const user = req.user;
    const body = toCreateFormDto();

    await controller.create(req, body);

    expect(createForm).toHaveBeenCalledWith(user, body, '203.0.113.5');
  });

  it('exportExcel should return StreamableFile from service', () => {
    const stream = Readable.from(['xlsx-bytes']);
    getControleExcelExport.mockReturnValue(
      new StreamableFile(stream, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: 'attachment; filename="controle.xlsx"',
      }),
    );

    const result = controller.exportExcel();

    expect(getControleExcelExport).toHaveBeenCalled();
    expect(result).toBeInstanceOf(StreamableFile);
  });
});
