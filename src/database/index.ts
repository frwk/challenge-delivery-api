import ComplaintMessage from '@/models/complaint-message.model';
import Complaint from '@/models/complaints.model';
import Courier from '@/models/couriers.model';
import Delivery from '@/models/deliveries.model';
import Reward from '@/models/rewards.model';
import User from '@/models/users.model';
import { NODE_ENV, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE } from '@config';
import { logger } from '@utils/logger';
import * as pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import mongooseDefault from 'mongoose';
import { config } from 'dotenv';

export const sequelize = new Sequelize(`postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}`, {
  dialectModule: pg,
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: NODE_ENV === 'development',
  logging:
    NODE_ENV === 'test'
      ? false
      : (query, time) => {
          logger.info(time + 'ms' + ' ' + query);
        },
  benchmark: true,
  models: [User, Delivery, Courier, Complaint, Reward, ComplaintMessage],
});

sequelize.authenticate();

// export const DB = {
//   Users: UserModel(sequelize),
//   sequelize, // connection instance (RAW queries)
//   Sequelize, // library
// };
