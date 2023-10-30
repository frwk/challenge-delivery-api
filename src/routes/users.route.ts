import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.userController.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, this.userController.getUserById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto), this.userController.createUser);
    this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(CreateUserDto, true), this.userController.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, this.userController.deleteUser);
  }
}
