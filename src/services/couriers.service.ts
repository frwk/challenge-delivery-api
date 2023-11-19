import { hash } from 'bcryptjs';
import { Service } from 'typedi';
import { CreateCourierDto } from '@dtos/couriers.dto';
import { HttpException } from '@/exceptions/HttpException';
import Courier from '@/models/couriers.model';
import User from '@/models/users.model';
import Complaint from '@/models/complaints.model';
import { FindOptions } from 'sequelize';
import CourierMongo, { CourierSchema } from '@/database/mongo/models/Courier';
import { InferSchemaType } from 'mongoose';
@Service()
export class CourierService {
  public async findAllCourier(options?): Promise<InferSchemaType<typeof CourierSchema>[]> {
    const allCourier: InferSchemaType<typeof CourierSchema>[] = await CourierMongo.find({
      ...options,
    });
    return allCourier;
  }

  public async findCourierById(courierId: number): Promise<InferSchemaType<typeof CourierSchema>> {
    const findCourier: InferSchemaType<typeof CourierSchema> = await CourierMongo.findById(courierId);
    if (!findCourier) throw new HttpException(404, "Courier doesn't exist");

    return findCourier;
  }

  public async createCourier(courierData: CreateCourierDto): Promise<Courier> {
    const findCourier: User = await User.findOne({
      where: {
        email: courierData.user.email,
      },
    });
    if (findCourier) throw new HttpException(409, `This email ${courierData.user.email} already exists`);
    const createCourierData: Courier = await Courier.create(
      { ...courierData, user: { ...courierData.user, role: 'courier' } },
      {
        include: [User],
      },
    );
    return createCourierData;
  }

  public async updateCourier(courierId: number, courierData: CreateCourierDto): Promise<Courier> {
    const findCourier: Courier = await Courier.findByPk(courierId);
    if (!findCourier) throw new HttpException(404, "Courier doesn't exist");
    await Courier.update(courierData, { where: { id: courierId } });
    const updateCourier: Courier = await Courier.findByPk(courierId);
    return updateCourier.dataValues;
  }

  public async deleteCourier(courierId: number): Promise<Courier> {
    const findCourier: Courier = await Courier.findByPk(courierId);
    if (!findCourier) throw new HttpException(404, "Courier doesn't exist");

    await Courier.destroy({ where: { id: courierId } });
    await Complaint.destroy({ where: { userId: findCourier.userId } });
    await User.destroy({ where: { id: findCourier.userId } });

    return findCourier;
  }
}
