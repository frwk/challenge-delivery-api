import ComplaintMessage from '@/models/complaint-message.model';
import Complaint from '@/models/complaints.model';
import Courier from '@/models/couriers.model';
import Delivery from '@/models/deliveries.model';
import Reward from '@/models/rewards.model';
import User from '@/models/users.model';
import { logger } from '@utils/logger';
import * as pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import mongooseDefault from 'mongoose';
import 'dotenv/config';

export const sequelize = new Sequelize(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`,
  {
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
    logQueryParameters: process.env.NODE_ENV === 'development',
    logging: (query, time) => {
      process.env.NODE_ENV !== 'test' ? logger.info(time + 'ms' + ' ' + query) : false;
    },
    benchmark: true,
    models: [User, Delivery, Courier, Complaint, Reward, ComplaintMessage],
  },
);

sequelize.authenticate();
