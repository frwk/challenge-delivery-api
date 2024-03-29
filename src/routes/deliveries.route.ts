import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { DeliveryController } from '@/controllers/deliveries.controller';
import { CreateDeliveryAsClientDto, CreateDeliveryDto, DeliveryDirectionDto, DeliveryTotalDto } from '@/dtos/deliveries.dto';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Roles } from '@/enums/roles.enum';

export class DeliveryRoute implements Routes {
  public path = '/deliveries';
  public router = Router();
  public deliveryController = new DeliveryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(Roles.ADMIN, Roles.SUPPORT), this.deliveryController.getDeliveries);
    this.router.get(`${this.path}/:id(\\d+)`, AuthMiddleware(), this.deliveryController.getDeliveryById);
    this.router.post(
      `${this.path}/direction`,
      AuthMiddleware(Roles.ADMIN, Roles.SUPPORT),
      ValidationMiddleware(DeliveryDirectionDto),
      this.deliveryController.getDirectionFromLatLng,
    );
    this.router.post(`${this.path}`, AuthMiddleware(Roles.ADMIN), ValidationMiddleware(CreateDeliveryDto), this.deliveryController.createDelivery);
    this.router.post(
      `/users${this.path}/new`,
      AuthMiddleware(Roles.CLIENT, Roles.ADMIN),
      ValidationMiddleware(CreateDeliveryAsClientDto),
      this.deliveryController.createDeliveryAsClient,
    );
    this.router.post(
      `/users${this.path}/total`,
      AuthMiddleware(Roles.CLIENT, Roles.ADMIN),
      ValidationMiddleware(DeliveryTotalDto),
      this.deliveryController.getDeliveryTotal,
    );
    this.router.patch(
      `${this.path}/:id(\\d+)`,
      AuthMiddleware(),
      ValidationMiddleware(CreateDeliveryDto, true),
      this.deliveryController.updateDelivery,
    );
    this.router.delete(`${this.path}/:id(\\d+)`, AuthMiddleware(Roles.ADMIN, Roles.SUPPORT), this.deliveryController.deleteDelivery);
    this.router.get(
      `/users/:clientId(\\d+)${this.path}`,
      AuthMiddleware(Roles.ADMIN, Roles.SUPPORT, Roles.CLIENT),
      this.deliveryController.getClientDeliveries,
    );
    this.router.get(
      `/users/:clientId(\\d+)${this.path}/current`,
      AuthMiddleware(Roles.ADMIN, Roles.SUPPORT, Roles.CLIENT),
      this.deliveryController.getClientCurrentDeliveries,
    );
    this.router.get(
      `/couriers/:courierId(\\d+)${this.path}`,
      AuthMiddleware(Roles.ADMIN, Roles.SUPPORT, Roles.COURIER),
      this.deliveryController.getCourierDeliveries,
    );
    this.router.get(
      `/couriers/:courierId(\\d+)${this.path}/pending`,
      AuthMiddleware(Roles.ADMIN, Roles.SUPPORT, Roles.COURIER),
      this.deliveryController.getNearbyDeliveries,
    );
    this.router.get(
      `/couriers/:courierId(\\d+)${this.path}/current`,
      AuthMiddleware(Roles.ADMIN, Roles.SUPPORT, Roles.COURIER),
      this.deliveryController.getCourierCurrentDelivery,
    );
  }
}
