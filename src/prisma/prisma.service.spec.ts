import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let connectSpy: jest.SpiedFunction<PrismaService['$connect']>;
  let disconnectSpy: jest.SpiedFunction<PrismaService['$disconnect']>;

  beforeEach(async () => {
    process.env.DATABASE_URL = 'file:./prisma/db.sqlite';

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get(PrismaService);
    connectSpy = jest
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined as never);
    disconnectSpy = jest
      .spyOn(service, '$disconnect')
      .mockResolvedValue(undefined as never);
  });

  afterEach(() => {
    connectSpy.mockRestore();
    disconnectSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('onModuleInit should connect to the database', async () => {
    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalled();
  });

  it('onModuleDestroy should disconnect from the database', async () => {
    await service.onModuleDestroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should throw when DATABASE_URL is not set', () => {
    const previous = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    expect(() => new PrismaService()).toThrow("DATABASE_URL n'est pas defini");

    process.env.DATABASE_URL = previous;
  });
});
