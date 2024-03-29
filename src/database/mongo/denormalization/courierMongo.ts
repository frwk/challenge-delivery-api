import Delivery from '@/models/deliveries.model';
import Courier from '@/models/couriers.model';
import CourierMongo from '../models/Courier';
import User from '@/models/users.model';

export default async function (courierId) {
  const courier = await Courier.findByPk(courierId, {
    include: [
      {
        model: Delivery,
        attributes: ['id', 'status', 'pickupLatitude', 'pickupLongitude', 'dropoffLatitude', 'dropoffLongitude', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5,
      },
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
  });
  await CourierMongo.deleteOne({ _id: courierId });

  const { id: user_id, ...courierUser } = courier.user.dataValues;

  const courierMongo = new CourierMongo({
    _id: courierId,
    ...courier.dataValues,
    deliveries: courier.deliveries.map(delivery => delivery.dataValues),
    user_id,
    ...courierUser,
  });
  await courierMongo.save();
}
