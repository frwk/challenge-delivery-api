import { Service } from 'typedi';
import Pricings from '@models/pricings.models';

@Service()
export default class PricingRepository {
  public async findByVehicleAndUrgency(vehicle, urgency) {
    return Pricings.findOne({
      where: {
        vehicle: vehicle,
        urgency: urgency,
      },
    });
  }
}
