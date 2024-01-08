import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@services/users.service';
import User from '@/models/users.model';
import { Roles } from '@/enums/roles.enum';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/HttpException';
import { CreateUserAsAdminDto } from '@/dtos/users/create.dto';
import { UpdateUserAsAdminDto, UpdateUserDto } from '@/dtos/users/update.dto';
import { compare } from 'bcryptjs';
import { VerifyPasswordDto } from '@/dtos/users/verify-password.dto';
import { DeliveryService } from '@/services/deliveries.service';
import { Sequelize } from 'sequelize';

export class UserController {
  public userService = Container.get(UserService);
  public deliveryService = Container.get(DeliveryService);

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
      const { email } = req.body as UpdateUserAsAdminDto | UpdateUserDto;
      if (email) {
        const existingUser = await this.userService.findOneUser({
          where: {
            email,
          },
        });
        if (existingUser && existingUser.id !== userId) {
          throw new HttpException(409, `Email ${email} already in use`);
        }
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

  public verifyPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findUser: User = await User.findByPk(req.params.id, { attributes: { include: ['password'] } });
      const data: VerifyPasswordDto = req.body;
      if (!findUser) throw new HttpException(404, "User doesn't exist");
      const isPasswordMatching: boolean = await compare(data.password, findUser.password);
      if (!isPasswordMatching) throw new HttpException(400, 'Password not matching');
      res.status(200).json({ message: 'Password matching' });
    } catch (error) {
      next(error);
    }
  };

  public getUserStats = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const user = await User.findByPk(userId);
      if (!user) throw new HttpException(404, 'User not found');
      if (req.user.role !== Roles.ADMIN) {
        if (req.user.id !== userId) throw new HttpException(403, 'Access denied');
      }
      const stats = await this.deliveryService.findAllDeliveries({
        where: {
          clientId: userId,
        },
        include: null,
        attributes: [
          [Sequelize.literal(`COUNT(CASE WHEN status = 'delivered' THEN 1 END)`), 'totalDeliveries'],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                'ST_DistanceSphere(' +
                  'ST_MakePoint(pickup_longitude, pickup_latitude),' +
                  'ST_MakePoint(dropoff_longitude, dropoff_latitude)' +
                  ') / 1000',
              ),
            ),
            'totalDistance',
          ],
          [Sequelize.fn('AVG', Sequelize.col('Delivery.notation')), 'averageRating'],
          [Sequelize.fn('SUM', Sequelize.literal('EXTRACT(EPOCH FROM (dropoff_date - pickup_date)) / 60 / 60')), 'totalDuration'],
        ],
        group: ['client_id'],
        raw: true,
      });
      res.status(200).json(stats[0]);
    } catch (error) {
      next(error);
    }
  };
}
