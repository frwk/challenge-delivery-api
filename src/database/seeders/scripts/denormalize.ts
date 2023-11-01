import courierMongo from '../../mongo/denormalization/courierMongo';
import userMongo from '../../mongo/denormalization/userMongo';
import Courier from '../../../models/couriers.model';
import User from '../../../models/users.model';
import mongoose from 'mongoose';
import { sequelize } from '@/database';
import Delivery from '@/models/deliveries.model';
import { config } from 'dotenv';

(async () => {
  try {
    await sequelize.authenticate();
    await mongoose.connect(process.env.MONGO_URL);
    const users = await User.findAll({ include: [{ model: Delivery }] });
    console.log('denormalizing users...');
    await Promise.all(
      users.map(async u => {
        await userMongo(u.id);
      }),
    );
    const couriers = await Courier.findAll();
    console.log('denormalizing couriers...');
    await Promise.all(
      couriers.map(async courier => {
        await courierMongo(courier.id);
      }),
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
  console.log('DONE !');
  await sequelize.close();
  await mongoose.connection.close();
})();
