import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import Delivery from '@/models/deliveries.model';
import { CreateDeliveryDto, UpdateDeliveryDto } from '@/dtos/deliveries.dto';

@Service()
export class DeliveryService {
  public async findAllDeliveries(): Promise<Delivery[]> {
    const allUser: Delivery[] = await Delivery.findAll({ include: [{ all: true }] });
    return allUser;
  }

  public async findDeliveryById(deliveryId: number): Promise<Delivery> {
    const delivery: Delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) throw new HttpException(409, "Delivery doesn't exist");

    return delivery;
  }

  public async createDelivery(data: CreateDeliveryDto): Promise<Delivery> {
    const createUserData: Delivery = await Delivery.create({ data });
    return createUserData;
  }

  public async updateDelivery(id: number, data: UpdateDeliveryDto): Promise<Delivery> {
    const delivery: Delivery = await Delivery.findByPk(id);
    if (!delivery) throw new HttpException(409, "Delivery doesn't exist");
    await delivery.update(data, { where: { id: id } });
    const updatedDelivery: Delivery = await Delivery.findByPk(id);
    return updatedDelivery;
  }

  public async deleteDelivery(id: number): Promise<Delivery> {
    const delivery: Delivery = await Delivery.findByPk(id);
    if (!delivery) throw new HttpException(409, "Delivery doesn't exist");

    await Delivery.destroy({ where: { id: id } });

    return delivery;
  }
}
