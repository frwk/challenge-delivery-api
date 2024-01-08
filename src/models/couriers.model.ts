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
  Default,
  DeletedAt,
  HasMany,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript';
import User from './users.model';
import Delivery from './deliveries.model';
import { CourierStatuses } from '@/enums/courier-statuses.enum';
import { DataTypes } from 'sequelize';
import userMongo from '@/database/mongo/denormalization/userMongo';
import courierMongo from '@/database/mongo/denormalization/courierMongo';
import restoreSequelizeAttributesOnClass from './helpers/restoreAttributes';
import { VehicleEnum } from '@/enums/vehicle.enum';

@Table({ tableName: 'couriers', underscored: true })
export default class Courier extends Model {
  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this);
  }

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Default(CourierStatuses.UNAVAILABLE)
  @Column(DataTypes.ENUM(CourierStatuses.AVAILABLE, CourierStatuses.UNAVAILABLE, CourierStatuses.ONDELIVERY))
  status: string;

  @Column({ type: 'DECIMAL(9,6)', allowNull: true })
  latitude: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: true })
  longitude: number;

  @Default(VehicleEnum.CAR)
  @Column(DataTypes.ENUM(VehicleEnum.MOTO, VehicleEnum.CAR, VehicleEnum.TRUCK))
  vehicle: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: ReturnType<() => User>;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => Delivery)
  deliveries: Delivery[];

  @AfterCreate
  @AfterUpdate
  static async handleMongoUpdate(instance: Courier) {
    await userMongo(instance.userId);
    await courierMongo(instance.id);
  }
}
