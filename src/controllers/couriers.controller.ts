import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateCourierDto, UpdateCourierDto } from '@dtos/couriers.dto';
import { CourierService } from '@services/couriers.service';
import Courier from '@/models/couriers.model';
import CourierMongo, { CourierSchema } from '@/database/mongo/models/Courier';
import { InferSchemaType } from 'mongoose';

export class CourierController {
  public courierService = Container.get(CourierService);

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
      console.log(findOneCourierData);
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
}
