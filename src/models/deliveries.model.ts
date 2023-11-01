import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  PrimaryKey,
  Table,
  UpdatedAt,
  Model,
  DeletedAt,
  Default,
  AfterUpdate,
  AfterCreate,
} from 'sequelize-typescript';
import User from './users.model';
import Courier from './couriers.model';
import { DataTypes } from 'sequelize';
import { DeliveryStatuses } from '@/enums/delivery-statuses.enum';
import userMongo from '@/database/mongo/denormalization/userMongo';
import courierMongo from '@/database/mongo/denormalization/courierMongo';

@Table({ tableName: 'deliveries', underscored: true })
export default class Delivery extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: false })
  pickup_latitude: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: false })
  pickup_longitude: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: false })
  dropoff_latitude: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: false })
  dropoff_longitude: number;

  @Column
  pickupDate: Date;

  @Column
  dropoffDate: Date;

  @Column
  confirmationCode: string;

  @Default(DeliveryStatuses.PENDING)
  @Column(DataTypes.ENUM(DeliveryStatuses.PENDING, DeliveryStatuses.PICKED_UP, DeliveryStatuses.DELIVERED, DeliveryStatuses.CANCELLED))
  status: string;

  @Column
  notation: number;

  @ForeignKey(() => User)
  @Column
  clientId: number;

  @BelongsTo(() => User)
  client: User;

  @ForeignKey(() => Courier)
  @Column
  courierId: number;

  @BelongsTo(() => Courier)
  courier: Courier;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @AfterCreate
  @AfterUpdate
  static async handleMongoUpdate(instance: Delivery) {
    await userMongo(instance.clientId);
    await courierMongo(instance.courierId);
  }
}
