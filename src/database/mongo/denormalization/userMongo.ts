import Delivery from '@/models/deliveries.model';
import UserMongo from '../models/User';
import User from '@/models/users.model';

export default async function (userId) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Delivery,
        attributes: ['id', 'status', 'pickup_latitude', 'pickup_longitude', 'dropoff_latitude', 'dropoff_longitude', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5,
      },
    ],
  });
  await UserMongo.deleteOne({ _id: userId });

  const userMongo = new UserMongo({
    _id: userId,
    ...user.dataValues,
    deliveries: user.deliveries.map(delivery => delivery.dataValues),
  });
  await userMongo.save();
}
