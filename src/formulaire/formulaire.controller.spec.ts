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
import { RolesGuard } from '../auth/guards/roles.guard';
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
    trustProxy?: boolean | number;
  } = {},
): RequestWithUser {
  return {
    user: mockAuthUser(),
    headers: overrides.headers ?? {},
    app: {
      get: (key: string) =>
        key === 'trust proxy' ? (overrides.trustProxy ?? false) : undefined,
    },
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
      .overrideGuard(RolesGuard)
      .useValue(createAllowAllGuard())
      .compile();

    controller = module.get(FormulaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should return 201 payload shape', async () => {
    createForm.mockResolvedValue({
      id: 'sub-1',
      status: 'accepted',
    });
    const req = mockRequest();
    const user = req.user;
    const body = toCreateFormDto({ client: 'casas' });

    const result = await controller.create(req, body);

    expect(createForm).toHaveBeenCalledWith(user, body, '127.0.0.1');
    expect(result.message).toBe('Formulaire crée avec succès');
    expect(result.data).toEqual({
      id: 'sub-1',
      status: 'accepted',
    });
  });

  it('create should ignore x-forwarded-for when trust proxy is off', async () => {
    createForm.mockResolvedValue({ id: 's', status: 'accepted' });
    const req = mockRequest({
      headers: { 'x-forwarded-for': '198.51.100.1, 10.0.0.2' },
      remoteAddress: '10.0.0.2',
      trustProxy: false,
    });
    const body = toCreateFormDto();

    await controller.create(req, body);

    expect(createForm).toHaveBeenCalledWith(req.user, body, '10.0.0.2');
  });

  it('create should use x-forwarded-for when trust proxy is on', async () => {
    createForm.mockResolvedValue({ id: 's', status: 'accepted' });
    const req = mockRequest({
      headers: { 'x-forwarded-for': '198.51.100.1, 10.0.0.2' },
      remoteAddress: '10.0.0.2',
      trustProxy: 1,
    });
    const body = toCreateFormDto();

    await controller.create(req, body);

    expect(createForm).toHaveBeenCalledWith(req.user, body, '198.51.100.1');
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
