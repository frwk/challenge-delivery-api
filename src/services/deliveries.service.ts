import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import Delivery from '@/models/deliveries.model';
import { CreateDeliveryDto, UpdateDeliveryDto } from '@/dtos/deliveries.dto';
import { Attributes, FindOptions } from 'sequelize';
import User from '@/models/users.model';

@Service()
export class DeliveryService {
  public async findAllDeliveries(options: FindOptions<Attributes<Delivery>> = {}): Promise<Delivery[]> {
    const defaultOptions = { include: { all: true } } as FindOptions<Attributes<Delivery>>;
    const allDeliveries: Delivery[] = await Delivery.findAll({ ...defaultOptions, ...options });
    return allDeliveries;
  }

  public async findDeliveryById(deliveryId: number): Promise<Delivery> {
    const delivery: Delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) throw new HttpException(404, "Delivery doesn't exist");

    return delivery;
  }

  public async createDelivery(data: CreateDeliveryDto): Promise<Delivery> {
    const createUserData: Delivery = await Delivery.create({ ...data });
    return createUserData;
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
}
