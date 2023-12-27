import { CourierController } from '@/controllers/couriers.controller';
import { CreateCourierDto } from '@/dtos/users/create.dto';
import { UpdateCourierDto } from '@/dtos/users/update.dto';
import { Roles } from '@/enums/roles.enum';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { Router } from 'express';

export class CourierRoute implements Routes {
  public path = '/couriers';
  public router = Router();
  public courierController = new CourierController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.courierController.getCouriers);
    this.router.get(`${this.path}/map`, this.courierController.getLocations);
    this.router.get(`${this.path}/:id(\\d+)`, this.courierController.getCourierById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateCourierDto), this.courierController.createCourier);
    this.router.patch(`${this.path}/:id(\\d+)`, ValidationMiddleware(UpdateCourierDto, true), this.courierController.updateCourier);
    this.router.delete(`${this.path}/:id(\\d+)`, this.courierController.deleteCourier);
    this.router.get(`${this.path}/:id(\\d+)/stats`, AuthMiddleware(Roles.ADMIN, Roles.COURIER), this.courierController.getCourierStats);
  }
}
