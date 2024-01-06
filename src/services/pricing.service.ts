import { Service } from 'typedi';
import { VehicleEnum } from '@/enums/vehicle.enum';
import { DeliveryUrgencyEnum } from '@/enums/delivery-urgency.enum';
import PricingRepository from '@/repository/pricing.repository';
import { HttpException } from '@exceptions/HttpException';
import Pricings from '@models/pricings.models';

@Service()
export class PricingService {
  constructor(public pricingRepository: PricingRepository) {}

  public async findPricingById(pricingId: number): Promise<Pricings> {
    const pricing: Pricings = await Pricings.findByPk(pricingId);

    if (!pricing) {
      return null;
    }

    return pricing;
  }

  public async findByVehicleAndUrgency(vehicle: VehicleEnum, urgency: DeliveryUrgencyEnum): Promise<Pricings> {
    const pricing: Pricings = await this.pricingRepository.findByVehicleAndUrgency(vehicle, urgency);

    if (!pricing) throw new HttpException(404, 'Pricing not found');
    return pricing;
  }
}
