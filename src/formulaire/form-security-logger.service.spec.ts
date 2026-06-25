import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { AuthUser } from '../auth/types/auth-user.type';
import { FormSecurityLoggerService } from './form-security-logger.service';
import { SecurityAction } from './security-action.enum';

describe('FormSecurityLoggerService', () => {
  let service: FormSecurityLoggerService;
  let logSpy: jest.SpiedFunction<Logger['log']>;

  const authUser: AuthUser = {
    id: 'user-1',
    email: 'agent@test.local',
    nom: 'Martin',
    prenom: 'Paul',
    role: 'agent',
    createdAt: new Date(),
    updatedAt: new Date(),
    failedLoginAttempts: 0,
    lockedUntil: null,
  };

  beforeEach(async () => {
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [FormSecurityLoggerService],
    }).compile();

    service = module.get(FormSecurityLoggerService);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log form action with user context and ISO date', () => {
    const date = new Date('2025-06-01T10:00:00.000Z');

    service.logFormAction(SecurityAction.FORM_CREATED, authUser, '10.0.0.5', {
      lieuControle: 'Gare',
      date,
      client: 'casas',
    });

    expect(logSpy).toHaveBeenCalledWith({
      action: SecurityAction.FORM_CREATED,
      userId: authUser.id,
      email: authUser.email,
      nom: authUser.nom,
      prenom: authUser.prenom,
      ipAddress: '10.0.0.5',
      lieuControle: 'Gare',
      client: 'casas',
      date: date.toISOString(),
    });
  });

  it('should stringify non-Date meta date values', () => {
    service.logFormAction(SecurityAction.FORM_CREATED, authUser, '127.0.0.1', {
      lieuControle: 'Arrêt',
      date: '2025-06-01' as unknown as Date,
      client: 'forbus',
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        date: '2025-06-01',
      }),
    );
  });
});
