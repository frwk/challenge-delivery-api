import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import User from '@/models/users.model';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@/exceptions/HttpException';
import 'dotenv/config';
import Courier from '@/models/couriers.model';
import { LoginUserDto, SignupDto } from '@/dtos/auth.dto';
import { PricingService } from '@/services/pricing.service';
import { CreatePricingDto } from '@/dtos/pricings.dto';
import Pricings from '@/models/pricings.models';

export class PricingController {
  public pricing = Container.get(PricingService);

  public createPricing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreatePricingDto = req.body;
      const pricing: Pricings = await this.pricing.createPricing(data);
      res.status(201).json(pricing);
    } catch (error) {
      next(error);
    }
  };
}
