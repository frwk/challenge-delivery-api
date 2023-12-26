import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserAsAdminDto, UpdateUserAsAdminDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Roles } from '@/enums/roles.enum';

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
    this.router.post(`${this.path}`, AuthMiddleware(Roles.ADMIN), ValidationMiddleware(CreateUserAsAdminDto), this.userController.createUser);
    this.router.patch(
      `${this.path}/:id(\\d+)`,
      AuthMiddleware(Roles.ADMIN),
      ValidationMiddleware(UpdateUserAsAdminDto),
      this.userController.updateUser,
    );
    this.router.patch(`/me`, AuthMiddleware(), ValidationMiddleware(UpdateUserDto), this.userController.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, this.userController.deleteUser);
  }
}
