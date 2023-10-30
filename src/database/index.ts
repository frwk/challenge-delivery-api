import Complaint from '@/models/complaints.model';
import Courier from '@/models/couriers.model';
import Delivery from '@/models/deliveries.model';
import Notation from '@/models/notations.model';
import Reward from '@/models/rewards.model';
import User from '@/models/users.model';
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';
import { logger } from '@utils/logger';
import * as pg from 'pg';
import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`, {
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
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
  models: [User, Delivery, Courier, Complaint, Notation, Reward],
});

sequelize.authenticate();

// export const DB = {
//   Users: UserModel(sequelize),
//   sequelize, // connection instance (RAW queries)
//   Sequelize, // library
// };
