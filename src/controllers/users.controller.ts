import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@services/users.service';
import User from '@/models/users.model';
import { Roles } from '@/enums/roles.enum';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/HttpException';
import { CreateUserAsAdminDto } from '@/dtos/users/create.dto';
import { UpdateUserAsAdminDto, UpdateUserDto } from '@/dtos/users/update.dto';

export class UserController {
  public userService = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json(findAllUsersData);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json(findOneUserData);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserAsAdminDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      res.status(201).json(createUserData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      let userId = Number(req.params.id);
      if (req.user.role !== Roles.ADMIN) {
        userId = req.user.id;
        if (!userId) throw new HttpException(403, 'Access denied');
      }
      const updateUserData: User = await this.userService.updateUser(userId, req.body as UpdateUserAsAdminDto | UpdateUserDto);
      res.status(200).json(updateUserData);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json(deleteUserData);
    } catch (error) {
      next(error);
    }
  };
}
