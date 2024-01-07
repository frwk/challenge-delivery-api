import FirebaseAdmin from '@/config/firebaseAdmin';
import { CreateDeliveryDto, DeliveryTotalDto, UpdateDeliveryDto } from '@/dtos/deliveries.dto';
import { Roles } from '@/enums/roles.enum';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { DeliveryWithDistances } from '@/interfaces/delivery.interface';
import Courier from '@/models/couriers.model';
import Delivery from '@/models/deliveries.model';
import User from '@/models/users.model';
import { DeliveryService } from '@/services/deliveries.service';
import { PricingService } from '@/services/pricing.service';
import { getCoordinates, getDistanceInMeters, getRouteInfos } from '@/utils/helpers';
import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { Container } from 'typedi';
import { LatLng } from '@googlemaps/google-maps-services-js';
import Pricings from '@/models/pricings.models';

export class DeliveryController {
  public deliveryService = Container.get(DeliveryService);
  public pricingService = Container.get(PricingService);

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
        include: [
          {
            model: Courier,
            include: [
              {
                model: User,
                attributes: ['firstName', 'lastName'],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
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
      if (!courier) throw new HttpException(404, 'Courier not found');
      if (req.user.role !== Roles.ADMIN) {
        if (req.user.id !== courier.userId) throw new HttpException(403, 'Access denied');
      }
      const deliveries: Delivery[] = await Delivery.findAll({
        where: { courierId: courierId },
        include: { model: User, as: 'client', attributes: ['firstName', 'lastName'] },
      });
      const deliveriesWithDistances: DeliveryWithDistances[] = deliveries.map(delivery => {
        const distance = getDistanceInMeters(delivery.pickupLatitude, delivery.pickupLongitude, delivery.dropoffLatitude, delivery.dropoffLongitude);
        const distanceToPickup = getDistanceInMeters(courier.latitude, courier.longitude, delivery.pickupLatitude, delivery.pickupLongitude);
        return { ...delivery.get({ plain: true }), distance, distanceToPickup };
      });
      res.status(200).json(deliveriesWithDistances);
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

  public getDeliveryTotal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: DeliveryTotalDto = req.body;
      const { distance, duration } = await getRouteInfos(data.pickupAddress, data.dropoffAddress);
      data.distance = distance.value;
      const deliveryTotal = await this.deliveryService.calculateDeliveryTotal(data.vehicle, data.urgency, distance.value);
      data.total = deliveryTotal;
      data.duration = duration.value;
      return res.status(200).json(data);
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

  public createDeliveryAsClient = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const client = await User.findByPk(req.body.clientId);
      if (!client) throw new HttpException(404, 'User not found');
      if (req.user.role !== Roles.ADMIN) {
        if (req.user.id !== client.id) throw new HttpException(403, 'Access denied');
      }
      const data: CreateDeliveryDto = req.body;
      if (data.pickupAddress && data.dropoffAddress) {
        const [pickupLocation, dropoffLocation] = await Promise.all([getCoordinates(data.pickupAddress), getCoordinates(data.dropoffAddress)]);
        [data.pickupLongitude, data.pickupLatitude] = pickupLocation;
        [data.dropoffLongitude, data.dropoffLatitude] = dropoffLocation;
      }
      const { distance } = await getRouteInfos(data.pickupAddress, data.dropoffAddress);
      const deliveryTotal = await this.deliveryService.calculateDeliveryTotal(data.vehicle, data.urgency, distance.value);
      data.total = deliveryTotal;
      const pricing = await this.pricingService.findByVehicleAndUrgency(data.vehicle, data.urgency);
      data.pricingId = pricing.id;
      data.confirmationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const delivery: Delivery = await this.deliveryService.createDelivery(data);
      this.sendNewDeliveryNotification(delivery.id);
      res.status(201).json(delivery);
    } catch (error) {
      console.log(error);
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
    if (!nearbyCouriers.length) return;
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

  public getNearbyDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courierId = Number(req.params.courierId);
      const courier = await Courier.findByPk(courierId);
      if (!courier) throw new HttpException(404, 'Courier not found');
      const deliveries: Delivery[] = await Delivery.findAll({
        where: Sequelize.literal(
          `ST_Distance(ST_MakePoint(pickup_longitude, pickup_latitude)::geography, ST_MakePoint(${courier.longitude}, ${courier.latitude})::geography) <= 15000000
          AND status = 'pending'
          AND pricing.vehicle = '${courier.vehicle}'
          `,
        ),
        include: [
          {
            model: User,
            attributes: ['id', 'email', 'firstName', 'lastName', 'deletedAt'],
          },
          {
            model: Pricings,
            attributes: ['id', 'vehicle'],
            as: 'pricing',
          },
        ],
      });
      const deliveriesWithDistances: DeliveryWithDistances[] = deliveries.map(delivery => {
        const distance = getDistanceInMeters(delivery.pickupLatitude, delivery.pickupLongitude, delivery.dropoffLatitude, delivery.dropoffLongitude);
        const distanceToPickup = getDistanceInMeters(courier.latitude, courier.longitude, delivery.pickupLatitude, delivery.pickupLongitude);
        return { ...delivery.get({ plain: true }), distance, distanceToPickup };
      });
      res.status(200).json(deliveriesWithDistances);
    } catch (error) {
      next(error);
    }
  };

  public getCourierCurrentDelivery = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const courierId = Number(req.params.courierId);
      const courier = await Courier.findByPk(courierId);
      if (!courier) throw new HttpException(404, 'Courier not found');
      if (req.user.role !== Roles.ADMIN) {
        if (req.user.id !== courier.userId) throw new HttpException(403, 'Access denied');
      }
      const delivery: Delivery = await Delivery.findOne({
        where: { courierId: courierId, status: { [Op.notIn]: ['pending', 'delivered', 'cancelled'] } },
        include: [
          {
            model: User,
            attributes: ['id', 'email', 'firstName', 'lastName', 'deletedAt'],
          },
        ],
      });
      if (!delivery) throw new HttpException(404, 'No current delivery');
      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  };
}
