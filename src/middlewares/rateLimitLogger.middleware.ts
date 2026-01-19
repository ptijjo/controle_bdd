import { Request, Response, NextFunction } from 'express';
import { securityLogger, SecurityAction } from '@/utils/securityLogger';

/**
 * Middleware pour logger les événements de rate limiting
 */
export const rateLimitLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (body: any) {
    // Si le rate limit est dépassé (status 429)
    if (res.statusCode === 429) {
      const ipAddress = String(req.ip || 'unknown');
      securityLogger.logSecurityEvent(
        SecurityAction.RATE_LIMIT_EXCEEDED,
        ipAddress,
        {
          path: req.path,
          method: req.method,
          userAgent: req.get('user-agent'),
        }
      );
    }

    return originalSend.call(this, body);
  };

  next();
};
