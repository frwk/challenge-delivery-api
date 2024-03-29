import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { LoginUserDto, SignupDto } from '@/dtos/auth.dto';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, ValidationMiddleware(SignupDto), this.auth.signUp);
    this.router.post(`${this.path}/login/admin`, ValidationMiddleware(LoginUserDto), this.auth.logInAdmin);
    this.router.post(`${this.path}/login`, ValidationMiddleware(LoginUserDto), this.auth.logIn);
    this.router.post(`${this.path}/logout`, AuthMiddleware(), this.auth.logOut);
    this.router.post(`${this.path}/check`, this.auth.isAuth);
  }
}
