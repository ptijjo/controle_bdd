import { PrismaService } from '../../prisma/prisma.service';

export type MockPrismaClient = {
  user: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  ipBlock: {
    findUnique: jest.Mock;
    update: jest.Mock;
    upsert: jest.Mock;
    deleteMany: jest.Mock;
  };
  loginAttempts: {
    create: jest.Mock;
  };
  usedInvitation: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
  refreshToken: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
  formSubmission: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  $transaction: jest.Mock;
};

export function createMockPrisma(): MockPrismaClient {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    ipBlock: {
      findUnique: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
    loginAttempts: {
      create: jest.fn(),
    },
    usedInvitation: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    formSubmission: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

export function mockPrismaServiceProvider(
  mock: MockPrismaClient = createMockPrisma(),
): { provide: typeof PrismaService; useValue: MockPrismaClient } {
  return {
    provide: PrismaService,
    useValue: mock,
  };
}
