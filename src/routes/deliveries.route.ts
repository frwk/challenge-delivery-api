import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { DeliveryController } from '@/controllers/deliveries.controller';
import { CreateDeliveryDto } from '@/dtos/deliveries.dto';

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
    this.router.post(`${this.path}`, ValidationMiddleware(CreateDeliveryDto), this.deliveryController.createDelivery);
    this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(CreateDeliveryDto, true), this.deliveryController.updateDelivery);
    this.router.delete(`${this.path}/:id(\\d+)`, this.deliveryController.deleteDelivery);
  }
}