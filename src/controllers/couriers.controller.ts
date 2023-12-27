import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CourierService } from '@services/couriers.service';
import Courier from '@/models/couriers.model';
import CourierMongo, { CourierSchema } from '@/database/mongo/models/Courier';
import { InferSchemaType } from 'mongoose';
import { DeliveryService } from '@/services/deliveries.service';
import { Sequelize } from 'sequelize';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Roles } from '@/enums/roles.enum';
import { HttpException } from '@/exceptions/HttpException';
import Delivery from '@/models/deliveries.model';
import { UpdateCourierDto } from '@/dtos/users/update.dto';
import { CreateCourierDto } from '@/dtos/users/create.dto';

export class CourierController {
  public courierService = Container.get(CourierService);
  public deliveryService = Container.get(DeliveryService);

  public getLocations = async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const findAllCouriers: InferSchemaType<typeof CourierSchema>[] = await this.courierService.findAllCourier();
    const sendCouriersLocations = setInterval(() => {
      res.write(`data: ${JSON.stringify(findAllCouriers)}\n\n`);
      res.flush();
    }, 5000);

    res.on('close', () => {
      console.log('client dropped me', new Date().toLocaleString());
      clearInterval(sendCouriersLocations);
      res.end();
    });
  };

  public getCouriers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCouriersData: InferSchemaType<typeof CourierSchema>[] = await this.courierService.findAllCourier();

      res.status(200).json(findAllCouriersData);
    } catch (error) {
      next(error);
    }
  };

  public getCourierById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courierId = Number(req.params.id);
      const findOneCourierData: InferSchemaType<typeof CourierSchema> = await this.courierService.findCourierById(courierId);
      res.status(200).json(findOneCourierData);
    } catch (error) {
      next(error);
    }
  };

  public createCourier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courierData: CreateCourierDto = req.body;
      const createCourierData: Courier = await this.courierService.createCourier(courierData);

      res.status(201).json(createCourierData);
    } catch (error) {
      next(error);
    }
  };

  public updateCourier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courierId = Number(req.params.id);
      const courierData: UpdateCourierDto = req.body;
      const updateCourierData: Courier = await this.courierService.updateCourier(courierId, courierData);

      res.status(200).json(updateCourierData);
    } catch (error) {
      next(error);
    }
  };

  public deleteCourier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courierId = Number(req.params.id);
      const deleteCourierData: Courier = await this.courierService.deleteCourier(courierId);

      res.status(200).json(deleteCourierData);
    } catch (error) {
      next(error);
    }
  };

  public getCourierStats = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const courierId = Number(req.params.id);
      const courier = await Courier.findByPk(courierId);
      if (!courier) throw new HttpException(404, 'Courier not found');
      if (req.user.role !== Roles.ADMIN) {
        if (req.user.id !== courier.userId) throw new HttpException(403, 'Access denied');
      }
      const stats = await this.deliveryService.findAllDeliveries({
        where: {
          courierId: courierId,
        },
        include: null,
        attributes: [
          [Sequelize.literal(`COUNT(CASE WHEN status = 'delivered' THEN 1 END)`), 'totalDeliveries'],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.fn(
                'ST_DistanceSphere',
                Sequelize.fn('ST_MakePoint', Sequelize.col('pickup_longitude'), Sequelize.col('pickup_latitude')),
                Sequelize.fn('ST_MakePoint', Sequelize.col('dropoff_longitude'), Sequelize.col('dropoff_latitude')),
              ),
            ),
            'totalDistance',
          ],
          [Sequelize.fn('AVG', Sequelize.col('Delivery.notation')), 'averageRating'],
          [Sequelize.fn('SUM', Sequelize.literal('EXTRACT(EPOCH FROM (dropoff_date - pickup_date)) / 60')), 'totalDuration'],
        ],
        group: ['courier_id'],
        raw: true,
      });
      res.status(200).json(stats[0]);
    } catch (error) {
      next(error);
    }
  };
}
