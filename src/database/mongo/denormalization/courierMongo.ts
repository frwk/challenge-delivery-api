import Delivery from '@/models/deliveries.model';
import Courier from '@/models/couriers.model';
import CourierMongo from '../models/Courier';
import User from '@/models/users.model';

export default async function (courierId) {
  const courier = await Courier.findByPk(courierId, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Delivery,
        attributes: ['id', 'status', 'pickup_latitude', 'pickup_longitude', 'dropoff_latitude', 'dropoff_longitude', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5,
      },
      {
        model: User,
        attributes: ['firstName', 'lastName'],
      },
    ],
  });
  await CourierMongo.deleteOne({ _id: courierId });

  const courierMongo = new CourierMongo({
    _id: courierId,
    ...courier.dataValues,
    deliveries: courier.deliveries.map(delivery => delivery.dataValues),
    ...courier.user.dataValues,
  });
  await courierMongo.save();
}
