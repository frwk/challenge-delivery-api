import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { LoginUserDto, SignupDto } from '@/dtos/auth.dto';
import { Roles } from '@/enums/roles.enum';
import { PricingController } from '@/controllers/pricings.controller';
import { CreatePricingDto } from '@/dtos/pricings.dto';

export class PricingRoute implements Routes {
  public path = '/pricings';
  public router = Router();
  public pricing = new PricingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, AuthMiddleware(Roles.ADMIN), ValidationMiddleware(CreatePricingDto), this.pricing.createPricing);
  }
}
