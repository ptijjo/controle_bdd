export type ThrottleConfigReader = {
  get: (key: string, defaultValue?: string) => string | undefined;
};

export function getThrottleModuleOptions(config: ThrottleConfigReader): {
  throttlers: Array<{ ttl: number; limit: number }>;
} {
  const ttl = Number(config.get('THROTTLE_TTL_MS', '60000'));
  const limit = Number(config.get('THROTTLE_LIMIT', '10'));

  return {
    throttlers: [
      {
        ttl: Number.isFinite(ttl) && ttl > 0 ? ttl : 60_000,
        limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
      },
    ],
  };
}
