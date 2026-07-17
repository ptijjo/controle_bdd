import type { Request } from 'express';

/**
 * IP client. Ne lit `X-Forwarded-For` / `X-Real-Ip` que si Express
 * `trust proxy` est activé (sinon spoofing possible).
 */
export function getClientIp(req: Request): string {
  const trust = req.app?.get?.('trust proxy');
  const trusted =
    trust === true ||
    (typeof trust === 'number' && trust > 0) ||
    (typeof trust === 'string' && trust.length > 0 && trust !== 'false');

  if (trusted) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0]?.trim() || '0.0.0.0';
    }
    const xReal = req.headers['x-real-ip'];
    if (typeof xReal === 'string' && xReal.length > 0) {
      return xReal.trim();
    }
  }

  return req.socket.remoteAddress ?? '0.0.0.0';
}
