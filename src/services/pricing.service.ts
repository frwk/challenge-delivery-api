import { Service } from 'typedi';
import { VehicleEnum } from '@/enums/vehicle.enum';
import { DeliveryUrgencyEnum } from '@/enums/delivery-urgency.enum';
import { HttpException } from '@exceptions/HttpException';
import Pricings from '@models/pricings.models';
import { Attributes, FindOptions } from 'sequelize';
import { CreatePricingDto } from '@/dtos/pricings.dto';

@Service()
export class PricingService {
  public async findPricingById(pricingId: number, options: FindOptions<Attributes<Pricings>> = {}): Promise<Pricings> {
    const pricing: Pricings = await Pricings.findByPk(pricingId, { ...options });
    if (!pricing) {
      return null;
    }
    return pricing;
  }

  public async findByVehicleAndUrgency(vehicle: VehicleEnum, urgency: DeliveryUrgencyEnum): Promise<Pricings> {
    const pricing: Pricings = await Pricings.findOne({
      where: {
        vehicle: vehicle,
        urgency: urgency,
      },
    });

    if (!pricing) throw new HttpException(404, 'Pricing not found');
    return pricing;
  }

  public async createPricing(data: CreatePricingDto): Promise<Pricings> {
    const pricing: Pricings = await Pricings.create({ ...data });
    return pricing;
  }
}
