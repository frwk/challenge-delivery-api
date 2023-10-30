import { Router } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { DeliveryController } from '@/controllers/deliveries.controller';

export class DeliveryRoute implements Routes {
  public path = '/deliveries';
  public router = Router();
  public deliveryController = new DeliveryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.deliveryController.getDeliveries);
    this.router.get(`${this.path}/:id(\\d+)`, this.deliveryController.getDeliveryById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto), this.deliveryController.createDelivery);
    this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(CreateUserDto, true), this.deliveryController.updateDelivery);
    this.router.delete(`${this.path}/:id(\\d+)`, this.deliveryController.deleteDelivery);
  }
}
