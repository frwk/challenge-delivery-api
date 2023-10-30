import { CreateDeliveryDto, UpdateDeliveryDto } from '@/dtos/deliveries.dto';
import Delivery from '@/models/deliveries.model';
import { DeliveryService } from '@/services/deliveries.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class DeliveryController {
  public deliveryService = Container.get(DeliveryService);

  public getDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveries: Delivery[] = await this.deliveryService.findAllDeliveries();

      res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  };

  public getDeliveryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const delivery: Delivery = await this.deliveryService.findDeliveryById(id);

      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  };

  public createDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateDeliveryDto = req.body;
      const delivery: Delivery = await this.deliveryService.createDelivery(data);

      res.status(201).json(delivery);
    } catch (error) {
      next(error);
    }
  };

  public updateDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data: UpdateDeliveryDto = req.body;
      const delivery: Delivery = await this.deliveryService.updateDelivery(id, data);

      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  };

  public deleteDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const delivery: Delivery = await this.deliveryService.deleteDelivery(id);

      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  };
}
