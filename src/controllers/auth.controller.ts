import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import User from '@/models/users.model';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@/exceptions/HttpException';
import 'dotenv/config';
import Courier from '@/models/couriers.model';
import { LoginUserDto, SignupDto } from '@/dtos/auth.dto';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: SignupDto = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      res.status(201).json(signUpUserData);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const { cookie, findUser } = await this.auth.login(userData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json(findUser);
    } catch (error) {
      next(error);
    }
  };

  public logInAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const { cookie, findUser } = await this.auth.loginAdmin(userData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json(findUser);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      res.setHeader('Set-Cookie', ['Authorization=; Path=/; Max-age=0']);
      res.status(200).json({ message: 'User logged out' });
    } catch (error) {
      next(error);
    }
  };

  public isAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const authorization = req.cookies['Authorization'] || (req.header('Authorization') || '').split('Bearer ')[1] || null;

      if (!authorization) {
        throw new HttpException(401, 'Authentication token missing');
      }
      const { id } = verify(authorization, process.env.SECRET_KEY) as DataStoredInToken;
      const findUser = await User.findByPk(id, {
        include: { model: Courier },
        paranoid: false,
      });
      if (!findUser) {
        throw new HttpException(401, 'Wrong authentication token');
      }
      res.status(200).json(findUser);
    } catch (error) {
      next(error);
    }
  };
}
