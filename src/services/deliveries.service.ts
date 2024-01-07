import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import Delivery from '@/models/deliveries.model';
import { CreateDeliveryAsClientDto, CreateDeliveryDto, DeliveryTotalDto, UpdateDeliveryDto } from '@/dtos/deliveries.dto';
import { Attributes, FindOptions } from 'sequelize';
import Pricing from '@models/pricings.models';
import { PricingService } from '@services/pricing.service';
import Pricings from '@models/pricings.models';
import { VehicleEnum } from '@/enums/vehicle.enum';
import { DeliveryUrgencyEnum } from '@/enums/delivery-urgency.enum';

@Service()
export class DeliveryService {
  constructor(public pricingService: PricingService) {}

  public async findAllDeliveries(options: FindOptions<Attributes<Delivery>> = {}): Promise<Delivery[]> {
    const defaultOptions = { include: { all: true } } as FindOptions<Attributes<Delivery>>;
    const allDeliveries: Delivery[] = await Delivery.findAll({ ...defaultOptions, ...options });
    return allDeliveries;
  }

  public async findDeliveryById(deliveryId: number, options: FindOptions<Attributes<Delivery>> = {}): Promise<Delivery> {
    const delivery: Delivery = await Delivery.findByPk(deliveryId, { ...options });
    if (!delivery) throw new HttpException(404, "Delivery doesn't exist");

    return delivery;
  }

  public async createDelivery(data: CreateDeliveryDto | CreateDeliveryAsClientDto): Promise<Delivery> {
    return await Delivery.create({ ...data });
  }

  public async updateDelivery(id: number, data: UpdateDeliveryDto): Promise<Delivery> {
    const delivery: Delivery = await Delivery.findByPk(id);
    if (!delivery) throw new HttpException(404, "Delivery doesn't exist");
    await delivery.update(data, { where: { id: id } });
    const updatedDelivery: Delivery = await Delivery.findByPk(id);
    if (!updatedDelivery) throw new HttpException(404, "Updated delivery doesn't exist");
    return updatedDelivery;
  }
  public async deleteDelivery(id: number): Promise<Delivery> {
    const delivery: Delivery = await Delivery.findByPk(id);
    if (!delivery) throw new HttpException(404, "Delivery doesn't exist");

    await Delivery.destroy({ where: { id: id } });

    return delivery;
  }

  public async calculateDeliveryTotal(vehicle: VehicleEnum, urgency: DeliveryUrgencyEnum, distance: number): Promise<number> {
    const pricing: Pricing = await this.pricingService.findByVehicleAndUrgency(vehicle, urgency);
    if (!pricing) throw new HttpException(404, "Pricing doesn't exist");

    let totalCost = (pricing.units + (distance / 1000) * Pricings.distanceRate) * Pricings.fixedRate;
    const minimumCost = Pricings.minimumCost;
    if (totalCost < minimumCost) {
      totalCost = minimumCost;
    }
    return totalCost;
  }
}
