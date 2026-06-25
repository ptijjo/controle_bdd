import { ConfigService } from '@nestjs/config';

const DEFAULT_TEST_CONFIG: Record<string, string> = {
  ACCESS_TOKEN_SECRET: 'access-secret',
  REFRESH_TOKEN_SECRET: 'refresh-secret',
  SECRET_KEY_INVITATION: 'invitation-secret',
  FRONT_END: 'https://front.test',
  ACCESS_TOKEN_EXPIRES_SEC: '900',
  REFRESH_TOKEN_EXPIRES_SEC: '604800',
  INVITATION_TOKEN_EXPIRES_SEC: '86400',
  LOGIN_IP_FAIL_BEFORE_BLOCK: '3',
  LOGIN_IP_BLOCK_MINUTES: '30',
  LOGIN_FAIL_BEFORE_ACCOUNT_LOCK: '3',
  LOGIN_ACCOUNT_LOCK_MINUTES: '30',
};

export type MockConfigOverrides = {
  get?: (key: string, defaultValue?: string) => string | undefined;
  getOrThrow?: (key: string) => string;
};

export type MockConfigService = {
  get: (key: string, defaultValue?: string) => string | undefined;
  getOrThrow: (key: string) => string;
};

export function createMockConfigService(
  overrides: MockConfigOverrides = {},
): MockConfigService {
  return {
    get: (key: string, defaultValue?: string) => {
      if (overrides.get) {
        const custom = overrides.get(key, defaultValue);
        if (custom !== undefined) return custom;
      }
      return DEFAULT_TEST_CONFIG[key] ?? defaultValue;
    },
    getOrThrow: (key: string) => {
      if (overrides.getOrThrow) {
        return overrides.getOrThrow(key);
      }
      const value = DEFAULT_TEST_CONFIG[key];
      if (value === undefined) {
        throw new Error(`unexpected config key: ${key}`);
      }
      return value;
    },
  };
}

export function mockConfigServiceProvider(
  overrides: MockConfigOverrides = {},
): { provide: typeof ConfigService; useValue: MockConfigService } {
  return {
    provide: ConfigService,
    useValue: createMockConfigService(overrides),
  };
}
