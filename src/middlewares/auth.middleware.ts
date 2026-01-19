import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import prisma from '@/utils/prisma';
import { logger } from '@/utils/logger';
import { securityLogger, SecurityAction } from '@/utils/securityLogger';

const getAuthorization = (req: RequestWithUser) => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization:string = getAuthorization(req);
    
    if (Authorization) {
      const { id } = verify(Authorization, SECRET_KEY) as DataStoredInToken;

      const users = prisma.user;
      const findUser = await users.findUnique({ where: { id: String(id) } });

      if (!findUser) {
        const ipAddress = String(req.ip || 'unknown');
        securityLogger.logSecurityEvent(
          SecurityAction.INVALID_TOKEN,
          ipAddress,
          { tokenId: String(id), reason: 'User not found' }
        );
        throw new HttpException(401, 'Wrong authentication token');
      }

      req.user = findUser;
      next();
    } else {
      const ipAddress = String(req.ip || 'unknown');
      securityLogger.logSecurityEvent(
        SecurityAction.UNAUTHORIZED_ACCESS,
        ipAddress,
        { reason: 'Missing authentication token', path: req.path }
      );
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    logger.error('AuthMiddleware error:', error);
    const ipAddress = String(req.ip || 'unknown');
    securityLogger.logSecurityEvent(
      SecurityAction.INVALID_TOKEN,
      ipAddress,
      { error: error instanceof Error ? error.message : 'Unknown error', path: req.path }
    );
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
