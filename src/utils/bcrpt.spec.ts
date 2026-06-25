import * as bcrypt from 'bcrypt';
import { BcryptService } from './bcrpt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
const mockCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(() => {
    mockHash.mockReset();
    mockCompare.mockReset();
    process.env.SALT_ROUNDS = '10';
    service = new BcryptService();
  });

  it('hashPassword should delegate to bcrypt.hash with SALT_ROUNDS', async () => {
    mockHash.mockResolvedValue('hashed' as never);

    const result = await service.hashPassword('secret');

    expect(mockHash).toHaveBeenCalledWith('secret', 10);
    expect(result).toBe('hashed');
  });

  it('comparePassword should delegate to bcrypt.compare', async () => {
    mockCompare.mockResolvedValue(true as never);

    const result = await service.comparePassword('secret', 'hash');

    expect(mockCompare).toHaveBeenCalledWith('secret', 'hash');
    expect(result).toBe(true);
  });
});
