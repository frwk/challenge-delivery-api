import FirebaseAdmin from '@/config/firebaseAdmin';
import { CreateDeliveryDto, UpdateDeliveryDto } from '@/dtos/deliveries.dto';
import { Roles } from '@/enums/roles.enum';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Courier from '@/models/couriers.model';
import Delivery from '@/models/deliveries.model';
import User from '@/models/users.model';
import { DeliveryService } from '@/services/deliveries.service';
import { getCoordinates, getDistanceInMeters } from '@/utils/helpers';
import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
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

  public getClientDeliveries = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const clientId = Number(req.params.clientId);
      if (req.user.role !== Roles.ADMIN) {
        if (req.user.id !== clientId) throw new HttpException(403, 'Access denied');
      }
      const client = await User.findByPk(clientId);
      if (!client) throw new HttpException(404, 'Client not found');
      const deliveries: Delivery[] = await Delivery.findAll({
        where: { clientId: clientId },
      });
      res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  };

  public getCourierDeliveries = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const courierId = Number(req.params.courierId);
      const courier = await Courier.findByPk(courierId);
      if (req.user.role !== Roles.ADMIN) {
        if (req.user.id !== courier.userId) throw new HttpException(403, 'Access denied');
      }
      if (!courier) throw new HttpException(404, 'Courier not found');
      const deliveries: Delivery[] = await Delivery.findAll({
        where: { courierId: courierId },
      });
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
      if (data.pickupAddress && data.dropoffAddress) {
        const [pickupLocation, dropoffLocation] = await Promise.all([getCoordinates(data.pickupAddress), getCoordinates(data.dropoffAddress)]);
        [data.pickupLongitude, data.pickupLatitude] = pickupLocation;
        [data.dropoffLongitude, data.dropoffLatitude] = dropoffLocation;
      }
      const delivery: Delivery = await this.deliveryService.createDelivery(data);
      this.sendNewDeliveryNotification(delivery.id);
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

  private sendNewDeliveryNotification = async (delivery: Delivery | number) => {
    if (typeof delivery === 'number') {
      delivery = await Delivery.findByPk(delivery, {
        include: [{ model: User, as: 'client', attributes: ['firstName', 'lastName'] }],
      });
    }
    const nearbyCouriers = await Courier.findAll({
      where: Sequelize.literal(
        `ST_Distance(ST_MakePoint(longitude, latitude)::geography, ST_MakePoint(${delivery.pickupLongitude}, ${delivery.pickupLatitude})::geography) <= 15000000
          AND status = 'available'
          `,
      ),
      include: [
        {
          model: User,
          attributes: ['notificationToken'],
          where: { notificationToken: { [Op.ne]: null } },
        },
      ],
      attributes: ['id'],
    });
    const message = {
      notification: {
        title: 'Demande de livraison',
        body: `Nouvelle livraison de ${getDistanceInMeters(
          delivery.pickupLatitude,
          delivery.pickupLongitude,
          delivery.dropoffLatitude,
          delivery.dropoffLongitude,
        )} mètres près de votre position`,
      },
      data: {
        click_action: 'OPEN_DELIVERY_DETAILS',
        deliveryId: delivery.id.toString(),
      },
      tokens: nearbyCouriers.map(courier => courier.user.notificationToken),
    };
    await FirebaseAdmin.getInstance().getMessaging().sendMulticast(message);
  };
}
