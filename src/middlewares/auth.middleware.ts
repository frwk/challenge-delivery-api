import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import 'dotenv/config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import User from '@/models/users.model';

const getAuthorization = req => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = verify(Authorization, process.env.SECRET_KEY) as DataStoredInToken;
      const findUser = await User.findByPk(id);

      if (findUser) {
        req.user = findUser;
        next();
      }
    }
    next(new HttpException(401, 'Wrong authentication token'));
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export const AuthWsMiddleware = async (ws: any, req: RequestWithUser, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = verify(Authorization, process.env.SECRET_KEY) as DataStoredInToken;
      const findUser = await User.findByPk(id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
