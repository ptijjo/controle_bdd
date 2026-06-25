import { PrismaService } from '../../prisma/prisma.service';

export type MockPrismaClient = {
  user: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
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
};

export function createMockPrisma(): MockPrismaClient {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
