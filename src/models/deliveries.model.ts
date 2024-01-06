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
import restoreSequelizeAttributesOnClass from './helpers/restoreAttributes';
import Pricing from '@models/pricings.models';

@Table({ tableName: 'deliveries', underscored: true })
export default class Delivery extends Model {
  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this);
  }

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: false })
  pickupLatitude: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: false })
  pickupLongitude: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: false })
  dropoffLatitude: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: false })
  dropoffLongitude: number;

  @Column
  pickupDate: Date;

  @Column
  dropoffDate: Date;

  @Column
  confirmationCode: string;

  @Default(DeliveryStatuses.PENDING)
  @Column(
    DataTypes.ENUM(
      DeliveryStatuses.PENDING,
      DeliveryStatuses.ACCEPTED,
      DeliveryStatuses.PICKED_UP,
      DeliveryStatuses.DELIVERED,
      DeliveryStatuses.CANCELLED,
    ),
  )
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

  @ForeignKey(() => Pricing)
  @Column
  pricingId: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: false })
  total: number;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @AfterCreate
  @AfterUpdate
  static async handleMongoUpdate(instance: Delivery) {
    if (instance.clientId) await userMongo(instance.clientId);
    if (instance.courierId) await courierMongo(instance.courierId);
  }
}
