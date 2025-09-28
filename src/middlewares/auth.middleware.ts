import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import prisma from '@/utils/prisma';

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
console.log(id)

      const users = prisma.user;
      const findUser = await users.findUnique({ where: { id: String(id) } });

      if (!findUser) {
        throw new HttpException(401, 'Wrong authentication token');
      }

      req.user = findUser;
      next();
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    console.error('AuthMiddleware error:', error);
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
