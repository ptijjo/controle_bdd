import { getThrottleModuleOptions } from './throttle.config.js';

describe('getThrottleModuleOptions', () => {
  it('should read limit and ttl from config with defaults', () => {
    const config = {
      get: jest.fn((key: string, defaultValue?: string) => {
        const map: Record<string, string> = {
          THROTTLE_LIMIT: '25',
          THROTTLE_TTL_MS: '120000',
        };
        return map[key] ?? defaultValue;
      }),
    };

    expect(getThrottleModuleOptions(config)).toEqual({
      throttlers: [{ ttl: 120_000, limit: 25 }],
    });
  });

  it('should fall back to 10 requests per 60s when env vars are absent', () => {
    const config = {
      get: jest.fn((_key: string, defaultValue?: string) => defaultValue),
    };

    expect(getThrottleModuleOptions(config)).toEqual({
      throttlers: [{ ttl: 60_000, limit: 10 }],
    });
  });
});
