import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Roles } from '@/enums/roles.enum';
import { CreateUserAsAdminDto } from '@/dtos/users/create.dto';
import { UpdateUserAsAdminDto, UpdateUserDto } from '@/dtos/users/update.dto';
import { VerifyPasswordDto } from '@/dtos/users/verify-password.dto';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(Roles.ADMIN), this.userController.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, AuthMiddleware(), this.userController.getUserById);
    this.router.post(`${this.path}`, AuthMiddleware(Roles.ADMIN), ValidationMiddleware(CreateUserAsAdminDto), this.userController.createUser);
    this.router.patch(
      `${this.path}/:id(\\d+)`,
      AuthMiddleware(Roles.ADMIN),
      ValidationMiddleware(UpdateUserAsAdminDto),
      this.userController.updateUser,
    );
    this.router.patch(`/me`, AuthMiddleware(), ValidationMiddleware(UpdateUserDto), this.userController.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, AuthMiddleware(Roles.ADMIN, Roles.SUPPORT), this.userController.deleteUser);
    this.router.post(
      `${this.path}/:id(\\d+)/verify-password`,
      AuthMiddleware(),
      ValidationMiddleware(VerifyPasswordDto),
      this.userController.verifyPassword,
    );
    this.router.get(`${this.path}/:id(\\d+)/stats`, AuthMiddleware(Roles.ADMIN, Roles.CLIENT), this.userController.getUserStats);
  }
}
